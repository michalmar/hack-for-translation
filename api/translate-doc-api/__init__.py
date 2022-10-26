import base64
import logging
from nturl2path import url2pathname
import os, uuid, sys
import json, random, string
import azure.functions as func
# from azure.common import AzureException
# from azure.storage.blob import BlobClient
import requests


import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.translation.document import DocumentTranslationClient
from azure.storage.blob import BlobServiceClient, BlobClient, generate_container_sas, generate_blob_sas
from azure.core.exceptions import ResourceExistsError
import datetime

def get_unique_filenames(filename, guid, lang_from, lang_to):
    filename_stem = filename.rsplit('.', 1)[0]
    filename_ext = filename.rsplit('.', 1)[1]
    filename_src = f"{filename_stem}___{guid}___{lang_from}.{filename_ext}"
    filename_tgt = f"{filename_stem}___{guid}___{lang_to}.{filename_ext}"
    return (filename_src, filename_tgt)


def create_container(blob_service_client, container_name):
        try:
            container_client = blob_service_client.create_container(container_name)
            print(f"Creating container: {container_name}")
        except ResourceExistsError:
            print(f"The container with name {container_name} already exists")
            container_client = blob_service_client.get_container_client(container=container_name)
        return container_client

def generate_sas_url_container(container, permissions,storage_account_name, storage_key, storage_endpoint):
        sas_token = generate_container_sas(
            account_name=storage_account_name,
            container_name=container.container_name,
            account_key=storage_key,
            permission=permissions,
            expiry=datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        )

        container_sas_url = storage_endpoint + container.container_name + "?" + sas_token
        print(f"Generating {container.container_name} SAS URL")
        return container_sas_url

def generate_sas_url(container, blob, permissions,storage_account_name, storage_key, storage_endpoint):
        sas_token = generate_blob_sas(
            account_name=storage_account_name,
            container_name=container.container_name,
            blob_name=blob,
            account_key=storage_key,
            permission=permissions,
            expiry=datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        )

        container_sas_url = storage_endpoint + container.container_name + "/" + blob + "?" + sas_token
        print(f"Generating {container.container_name} SAS URL")
        return container_sas_url

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    # checking for a POST request.
    fromLang = req.params.get('fromLang')
    if not fromLang:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            fromLang = req_body.get('fromLang')
    
    toLang = req.params.get('toLang')
    if not toLang:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            toLang = req_body.get('toLang')
            
    LANG_FROM = fromLang # "cs" 
    LANG_TO = toLang # "uk"
    logging.info(f"lang_from: {LANG_FROM}, lang_to: {LANG_TO}")

    for input_file in req.files.values():
        logging.info(f"getting file")
        filename = input_file.filename
        contents = input_file.stream.read()


        # # Get the file name
        filename = input_file.filename
        # # Get the file contents
        file_contents = input_file.read()
        # # Get the file extension
        file_extension = filename.rsplit('.', 1)[1].lower()
        # # Get the file size
        file_size = sys.getsizeof(file_contents)
        # # Get the file type
        file_type = input_file.content_type

        logging.info(f"filename: {filename}, file_extension: {file_extension}, file_size: {file_size}, file_type: {file_type}")

        guid = uuid.uuid1()

        (filename_unique_src, filename_unique_tgt) = get_unique_filenames(filename, guid, lang_from=LANG_FROM, lang_to=LANG_TO)

        logging.info('Filename: %s' % filename)
        logging.info('filename_unique_src: %s' % filename_unique_src)
        logging.info('filename_unique_tgt: %s' % filename_unique_tgt)

        # endpoint = f"{TRANSLATOR_DOCU_ENDPOINT}translator/text/batch/v1.0"
        TRANSLATOR_DOCU_ENDPOINT = os.environ["TRANSLATOR_DOCU_ENDPOINT"] 
        SUBSCRIPTION_KEY =  os.environ["TRANSLATOR_TEXT_SUBSCRIPTION_KEY"]
        STORAGE_KEY = os.environ["TRANSLATOR_DOCU_STORAGE_KEY"] 
        STORAGE_NAME = os.environ["TRANSLATOR_DOCU_STORAGE_NAME"]
        STORAGE_ENDPOINT = os.environ["TRANSLATOR_DOCU_STORAGE_ENDPOINT"]
        STORAGE_CONTAINER_SRC = os.environ["TRANSLATOR_DOCU_STORAGE_CONTAINER_SRC"]
        STORAGE_CONTAINER_TGT = os.environ["TRANSLATOR_DOCU_STORAGE_CONTAINER_TGT"]


        translation_client = DocumentTranslationClient(
            TRANSLATOR_DOCU_ENDPOINT, AzureKeyCredential(SUBSCRIPTION_KEY)
        )

        blob_service_client = BlobServiceClient(
            STORAGE_ENDPOINT, credential=STORAGE_KEY
        )

        source_container = create_container(
            blob_service_client,
            container_name=STORAGE_CONTAINER_SRC,
        )
        target_container = create_container(
            blob_service_client,
            container_name=STORAGE_CONTAINER_TGT
        )

        source_container.upload_blob(filename_unique_src, contents)
        logging.info(f"Uploaded document {filename_unique_src} to storage container {source_container.container_name}")

        source_container_sas_url = generate_sas_url(source_container, blob=filename_unique_src, permissions="rl", storage_account_name=STORAGE_NAME, storage_key=STORAGE_KEY, storage_endpoint=STORAGE_ENDPOINT)
        target_container_sas_url_file = generate_sas_url(target_container, blob=filename_unique_src, permissions="rw", storage_account_name=STORAGE_NAME, storage_key=STORAGE_KEY, storage_endpoint=STORAGE_ENDPOINT)
        target_container_sas_url = generate_sas_url_container(target_container, permissions="wl", storage_account_name=STORAGE_NAME, storage_key=STORAGE_KEY, storage_endpoint=STORAGE_ENDPOINT)

        logging.info(f"Source container SAS URL: {source_container_sas_url}")
        logging.info(f"Target container SAS URL File: {target_container_sas_url_file}")
        logging.info(f"Target container SAS URL: {target_container_sas_url}")

        poller = translation_client.begin_translation(source_url=source_container_sas_url, 
                                                        target_url=target_container_sas_url, 
                                                        target_language=LANG_TO, 
                                                        source_language=LANG_FROM, 
                                                        storage_type="File")
                                                        
        print(f"Created translation operation with ID: {poller.id}")
        print("Waiting until translation completes...")

        result = poller.result()
        print(f"Status: {poller.status()}")

        print("\nDocument results:")
        for document in result:
            print(f"Document ID: {document.id}")
            print(f"Document status: {document.status}")
            if document.status == "Succeeded":
                print(f"Source document location: {document.source_document_url}")
                print(f"Translated document location: {document.translated_document_url}")
                print(f"Translated to language: {document.translated_to}\n")

                response = {
                    "original_filename": filename,
                    "translated_filename": filename_unique_src, # TODO
                    "fileurl": target_container_sas_url_file,
                }
                ret = json.dumps(response, sort_keys=True, indent=4, separators=(',', ': '))
                return func.HttpResponse(
                        ret,
                        status_code=200
                )
            else:
                print("\nThere was a problem translating your document.")
                print(f"Document Error Code: {document.error.code}, Message: {document.error.message}\n")
                return func.HttpResponse(
                    "Please pass a file in the request body",
                    status_code=400
                )