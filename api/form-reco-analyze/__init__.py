import logging
import os
import json


import azure.functions as func

from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function to process Form.')

    # This is the call to the Form Recognizer endpoint
    endpoint = os.environ["FORM_RECO_ENDPOINT"]
    apim_key = os.environ["FORM_RECO_KEY"]
    model_id = os.environ["FORM_RECO_ENDPOINT_MODEL_ID"]
    full_recognizer_output = False

    for input_file in req.files.values():
        text1 = input_file.filename
        source = input_file.stream.read()

        # source = blobin.read()
        # text1=os.path.basename(blobin.name)

        document_analysis_client = DocumentAnalysisClient(
            endpoint=endpoint, credential=AzureKeyCredential(apim_key)
        )

        # Make sure your document's type is included in the list of document types the custom model can analyze
        # poller = document_analysis_client.begin_analyze_document_from_url(model_id, documentUrl)
        poller = document_analysis_client.begin_analyze_document(model_id, source)

        result = poller.result()
        detected_kv_pairs = []
        response = []
        for idx, document in enumerate(result.documents):
            print("--------Analyzing document #{}--------".format(idx + 1))
            print("Document has type {}".format(document.doc_type))
            print("Document has confidence {}".format(document.confidence))
            print("Document was analyzed by model with ID {}".format(result.model_id))
            for name, field in document.fields.items():
                if (field.value_type == 'string'):
                    field_value = field.value if field.value else field.content
                    print(u"......found field {} of type '{}' with value '{}' and with confidence {}".format(name,field.value_type, field_value, field.confidence).encode('utf-8'))
                    print(f"found {name}")
                    # detected_kv_pairs.append([name, field_value, field.confidence])
                    detected_kv_pairs
                    response.append({
                        "key": name,
                        "val": field_value,
                        "confidence": field.confidence
                    })
        ret = json.dumps(response, sort_keys=True, indent=4, separators=(',', ': '))



        # print("----Key-value pairs found in document----")
        # for kv_pair in result.key_value_pairs:
        #     # if kv_pair.key:
        #     #     print(
        #     #             "Key '{}' found within '{}' bounding regions".format(
        #     #                 kv_pair.key.content,
        #     #             )
        #     #         )
        #     # if kv_pair.value:
        #     #     print(
        #     #             "Value '{}' found within '{}' bounding regions\n".format(
        #     #                 kv_pair.value.content,
        #     #                 format_bounding_region(kv_pair.value.bounding_regions),
        #     #             )
        #     #         )

        #     print(u"......found field {} with value '{}'".format(kv_pair.key.content, kv_pair.value.content).encode('utf-8'))
        # #         

        # # convert detected key-value pairs to Pandas dataframe        
        # document_detected_kv_pairs = pd.DataFrame(detected_kv_pairs, columns =['Key', 'Value','Confidence'])

        print(f"document analyzed.")

        if (full_recognizer_output):
            # iterate over tables, lines, and selection marks on each page
            for page in result.pages:
                print("\nLines found on page {}".format(page.page_number))
                for line in page.lines:
                    print("...Line '{}'".format(line.content.encode('utf-8')))
                for word in page.words:
                    print(
                        "...Word '{}' has a confidence of {}".format(
                            word.content.encode('utf-8'), word.confidence
                        )
                    )
                for selection_mark in page.selection_marks:
                    print(
                        "...Selection mark is '{}' and has a confidence of {}".format(
                            selection_mark.state, selection_mark.confidence
                        )
                    )

            for i, table in enumerate(result.tables):
                print("\nTable {} can be found on page:".format(i + 1))
                for region in table.bounding_regions:
                    print("...{}".format(i + 1, region.page_number))
                for cell in table.cells:
                    print(
                        "...Cell[{}][{}] has content '{}'".format(
                            cell.row_index, cell.column_index, cell.content.encode('utf-8')
                        )
                    )
            print("-----------------------------------")
        

        # # convert dataframe into json then to byte array
        # blob_out_bytes = bytes(document_detected_kv_pairs.to_json(orient="records"), encoding='utf-8')
        
        # # store in the output storage through Functions output binding
        # blobout.set(blob_out_bytes)

    error = False

    if not error:
        # return func.HttpResponse(f"This HTTP triggered function executed successfully.")
        # return json.dumps(detected_kv_pairs)
        return func.HttpResponse(
            ret,
            status_code=200
        )
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )
