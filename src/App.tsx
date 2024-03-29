import React, { useState } from 'react';
import logo from './logo.png';
import doclogo from './microsoft-translator.jpg'
import './custom.css';
import Cookie from 'universal-cookie';

//Speech imports
import { ResultReason,  
  TranslationRecognizer, 
  TranslationRecognitionEventArgs, 
  SessionEventArgs, 
  // TranslationRecognitionResult,
  TranslationRecognitionCanceledEventArgs } from "microsoft-cognitiveservices-speech-sdk";

// Fluent UI imports
import { Stack, IStackStyles, Text} from '@fluentui/react';
// import { Stack, Text, Link, FontWeights, IStackTokens, IStackStyles, ITextStyles } from '@fluentui/react';
import { TextField } from '@fluentui/react/lib/TextField';
import { ProgressIndicator } from '@fluentui/react/lib/ProgressIndicator';
import { IStackProps } from '@fluentui/react/lib/Stack';
import { PrimaryButton, ActionButton } from '@fluentui/react/lib/Button';
import { IIconProps, initializeIcons } from '@fluentui/react';
import { IStyleSet, Label, ILabelStyles, Pivot, PivotItem } from '@fluentui/react';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardPreview,
  DocumentCardTitle,
  IDocumentCardPreviewProps,
} from '@fluentui/react/lib/DocumentCard';
import { ImageFit } from '@fluentui/react/lib/Image';
import { ActivityItem, IActivityItemProps, Link } from '@fluentui/react';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
// import { DetailsList, DetailsRow, IDetailsRowStyles, IDetailsListProps } from '@fluentui/react/lib/DetailsList';
// import { Document, Page } from 'react-pdf';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const optionsLangFrom: IDropdownOption[] = [
  { key: 'bg', text: 'Bulgarian' },
  { key: 'hr', text: 'Croatian' },
  { key: 'cs', text: 'Czech' },
  { key: 'da', text: 'Danish' },
  { key: 'nl', text: 'Dutch' },
  { key: 'en', text: 'English' },
  { key: 'et', text: 'Estonian' },
  { key: 'fi', text: 'Finnish' },
  { key: 'fr', text: 'French' },
  { key: 'fr-ca', text: 'French (Canada)' },
  { key: 'de', text: 'German' },
  { key: 'el', text: 'Greek' },
  { key: 'hu', text: 'Hungarian' },
  { key: 'it', text: 'Italian' },
  { key: 'ja', text: 'Japanese' },
  { key: 'ko', text: 'Korean' },
  { key: 'lv', text: 'Latvian' },
  { key: 'lt', text: 'Lithuanian' },
  { key: 'nb', text: 'Norwegian' },
  { key: 'pl', text: 'Polish' },
  { key: 'ro', text: 'Romanian' },
  { key: 'ru', text: 'Russian' },
  { key: 'sk', text: 'Slovak' },
  { key: 'sl', text: 'Slovenian' },
  { key: 'es', text: 'Spanish' },
  { key: 'sv', text: 'Swedish' },
  { key: 'tr', text: 'Turkish' },
  { key: 'uk', text: 'Ukrainian' },
  
];

const optionsLangTo: IDropdownOption[] = [
  { key: 'bg', text: 'Bulgarian' },
{ key: 'hr', text: 'Croatian' },
{ key: 'cs', text: 'Czech' },
{ key: 'da', text: 'Danish' },
{ key: 'nl', text: 'Dutch' },
{ key: 'en', text: 'English' },
{ key: 'et', text: 'Estonian' },
{ key: 'fi', text: 'Finnish' },
{ key: 'fr', text: 'French' },
{ key: 'fr-ca', text: 'French (Canada)' },
{ key: 'de', text: 'German' },
{ key: 'el', text: 'Greek' },
{ key: 'hu', text: 'Hungarian' },
{ key: 'it', text: 'Italian' },
{ key: 'ja', text: 'Japanese' },
{ key: 'ko', text: 'Korean' },
{ key: 'lv', text: 'Latvian' },
{ key: 'lt', text: 'Lithuanian' },
{ key: 'nb', text: 'Norwegian' },
{ key: 'pl', text: 'Polish' },
{ key: 'ro', text: 'Romanian' },
{ key: 'ru', text: 'Russian' },
{ key: 'sk', text: 'Slovak' },
{ key: 'sl', text: 'Slovenian' },
{ key: 'es', text: 'Spanish' },
{ key: 'sv', text: 'Swedish' },
{ key: 'tr', text: 'Turkish' },
{ key: 'uk', text: 'Ukrainian' },

];


const speechsdk = require("microsoft-cognitiveservices-speech-sdk");
const optionsSpeech = [
  { value: "en", label: "English", translation: "Emglish:" },
  { value: "pl", label: "Polish", translation: "Polish:" },
  { value: "uk", label: "Ukrainian", translation: "Ukrainian:" },
];
const choiceoptions: IChoiceGroupOption[] = [
  { key: 'p', text: 'Pacient (UA)', iconProps: { iconName: 'Microphone' } },
  { key: 'l', text: 'Lékař   (CZ)', iconProps: { iconName: 'Microphone' } },
];


const previewProps: IDocumentCardPreviewProps = {
  previewImages: [
    {
      // name: 'Revenue stream proposal fiscal year 2016 version02.pptx',
      linkProps: {
        // href: 'http://bing.com',
        target: '_blank',
      },
      previewImageSrc: doclogo,
      // iconSrc: logo,
      imageFit: ImageFit.cover,
      width: 300,
      // height: 196,
    },
  ],
};
const DocumentCardActivityPeople = [{ name: 'Azure Translator', profileImageSrc: "" }];

initializeIcons();
// const boldStyle: Partial<ITextStyles> = { root: { fontWeight: FontWeights.semibold } };


// const options: IChoiceGroupOption[] = [
//   { key: 'ukcs', text: 'Ukrajinsky -> Česky' },
//   { key: 'csuk', text: 'Česky -> Ukrajinsky' },
// ];

const stackStyles: Partial<IStackStyles> = { root: { width: 850 } };
const stackTokens = { childrenGap: 50 };
// const dummyText: string = "aaaa";
const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: 650 } },
};



const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: { marginTop: 10 },
};


type speechTokenResponse = {
  authToken: string,
  region: string
}
type formRecoResponseRecord = {
  key: string,
  val: string,
  confidence: string
}

type translateTextResponse = {
  translations: translateTextResponseRecord[];
}
type translateTextResponseRecord = {
  text: string,
  to: string
}
type translateDocResponse = {
  fileurl: string,
  original_filename: string,
  translated_filename: string
}

// main variable for Speech Recognition
var recognizer: TranslationRecognizer;

// export default class App extends Component {
export const App: React.FunctionComponent = () => {

  // speech translation
  const [displayText, setDisplayText] = useState<string>("Zmáčkněte start a mluvte....")
  const [en, setEN] = useState<string>("Press start and speak...");
  const [pl, setPL] = useState<string>("Naciśnij start i mów...");
  const [uk, setUK] = useState<string>("Натисніть почати і говорити...");
  // const [cs, setCS] = useState<string>("Zmáčkněte start a mluvte....");

  const [patientSpeaking, setPatientSpeaking] = useState<boolean>(false);
  const [recognizing, setRecognizing] = useState(false);
  const [theArray, setTheArray] = useState<(IActivityItemProps & { key: string | number })[]>([]);
  

  const [fileSelected, setFileSelected] = useState<File| null>();
  const [text, setText] = React.useState("We want to be the enablers of meaningful human connection because togetherness is powerful. We create the crossroads that allow us all to meet, to agree, to disagree and to care. Together we can see more, feel more and change more for the planet, people and communities. We believe that each moment we are together matters and each conversation and meaningful connection could be the start of a new legacy. In today’s world, human togetherness, sense of belonging and connecting to nature are more important than ever.");
  const [uploading, setUploading] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [processedDocument, setProcessedDocument] = useState(false);
  const [translatedResults, setTranslatedResults] = useState<translateTextResponse>();
  const [translatedFiles, setTranslatedFiles] = useState<translateDocResponse>();

  const [formRecoResults, setFormRecoResults] = useState<formRecoResponseRecord[]>([]);

  // const [fromLang, setFromLang] = useState<string>("uk");
  // const [toLang, setToLang] = useState<string>("cs");
  

  const addDownloadIcon: IIconProps = { iconName: 'Download' };

  //translate text dropdown
  const [selectedItemLangFrom, setSelectedItemLangFrom] = React.useState<IDropdownOption>(optionsLangFrom[5]);
  const [selectedItemLangTo, setSelectedItemLangTo] = React.useState<IDropdownOption>(optionsLangTo[2]);
  
  function getRandomInt() {
    return Math.floor(Math.random() * 10000);
  }
  
  const addEntryClick = (who:string, translation:string, original:string) => {
      if(translation) {
        let imgurl = "xxx"
        if (who ==="Doctor") {
          imgurl = "http://purecatamphetamine.github.io/country-flag-icons/3x2/CZ.svg"
        }
        else {
          imgurl = "http://purecatamphetamine.github.io/country-flag-icons/3x2/UA.svg"
        }
        let key = getRandomInt();
        let entry = {
          key: key,
          activityDescription: [
            <Link>{who}</Link>,
            <span> said</span>,
          ],
          // activityIcon: <Icon iconName={'Message'} />,
          activityPersonas: [{ imageUrl: imgurl }],
          comments: [
            <span key={key+1}>{translation} </span>,
            
          ],
          timeStamp: original,
        }
        setTheArray(oldArray => [...oldArray, entry]);
        console.log("pridavam!"+key)
      } else {
        console.log("nepridavam")
      }
  };

  
  function api<T>(url: string, requestOptions: RequestInit): Promise<T[]> {
    return fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => data as T[])
  }
  function api2<T>(url: string, requestOptions: RequestInit): Promise<T> {
    return fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => data as T)
  }

  const onTextChange = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setText(newValue || '');
    },
    [],
  );

  const onFormUploaded = async()  => {
    if (fileSelected) {
      setUploading(true);
      setProcessed(false);
      setProcessedDocument(false);
      const formData = new FormData();
      formData.append('file', fileSelected);
      const requestOptions = {
        method: 'POST',
        body: formData,
      };

      let data = await api<formRecoResponseRecord>("/api/form-reco-analyze", requestOptions)
          .then((response) => {
            // console.log("xxxxx", response)
            return response;
            
          })
          .catch(error => console.log('error', error));
    
      if (data) {
        console.log("data",data)

        setFormRecoResults(data);

      } else {
        console.log("no data")
      }
      
      setProcessed(true);
      setProcessedDocument(true);
      setUploading(false);
    }
  }

  const onTranslate = async () => {
    // prepare UI
    setUploading(true);
    setProcessed(false);

    // *** SEND TEXT TO Azure Functions ***

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    // console.log('Translating from ', fromLang)
    // console.log('Translating to ', toLang)

    // console.log('Translating from ', selectedItemLangFrom.key)
    // console.log('Translating to ', selectedItemLangTo)

    // console.log("text",)
    let tt =  text.replaceAll("\n","<NEWLINE>").replaceAll("\r","<NEWLINE>")

    var requestOptions : RequestInit = {
      method: 'POST',
      headers: myHeaders,
      // body: '{"text": "'+text+'", "fromLang": "'+fromLang+'", "toLang":"'+toLang+'"}',
      body: '{"text": "'+tt+'", "fromLang": "'+selectedItemLangFrom.key+'", "toLang":"'+selectedItemLangTo.key+'"}',
      redirect: 'follow',
    };
    
    let data = await api<translateTextResponse>("/api/translate-text-api", requestOptions)
        .then((response) => {
          return response;
          
        })
        .catch(error => console.log('error', error));
  
    if (data) {
      console.log("data",data)
      // if (data[0]) {

      // }
      setTranslatedResults(data[0]);

    } else {
      console.log("no data")
    }
    
    setProcessed(true)

    // reset state/form
    setFileSelected(null);
    setUploading(false);
  }
  const onFileChange = React.useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
    setFileSelected(event.currentTarget.files?.item(0));
    
  },[],
  );

  const onFileUpload = async () => {
      // prepare UI
      setUploading(true);
      setProcessedDocument(false);

      // // *** UPLOAD TO AZURE STORAGE ***
      // // const blobsInContainer = await uploadFileToBlob(fileSelected);
      if (fileSelected){
        // *** SEND FILE TO Azure Functions ***
        var formdata = new FormData();
        formdata.append("file", fileSelected, fileSelected.name);

        var requestOptions : RequestInit = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };

        // body: '{"text": "'+tt+'", "fromLang": "'+selectedItemLangFrom.key+'", "toLang":"'+selectedItemLangTo.key+'"}',


        let data = await api2<translateDocResponse>("/api/translate-doc-api?fromLang="+selectedItemLangFrom.key+"&toLang="+selectedItemLangTo.key+"", requestOptions)
          .then((response) => {
            return response;
          })
          .catch(error => console.log('error', error));
        
        if (data) {
          setTranslatedFiles(data)
        }
          
        // await sleep(10*1000) //wait 10 seconds
        
        setProcessedDocument(true)
      }
      // reset state/form
      setFileSelected(null);
      setUploading(false);
    };

  function showTranslatedDocumentResult(translatedFiles: translateDocResponse | undefined): React.ReactNode {
    let docname = ""
    let href = ""
    if (translatedFiles) {
      docname = translatedFiles?.translated_filename
      href = translatedFiles.fileurl
    }
    return (
      <Stack>
        
        {/* {translatedFiles?.translated_filename} */}
        <ActionButton iconProps={addDownloadIcon}  href={translatedFiles?.fileurl} target="_blank" >stáhnout přeložený dokument</ActionButton>
        <DocumentCard
              aria-label="Default Document Card with large file name..."
              onClickHref={href}
            >
              <DocumentCardPreview {...previewProps} />
              <DocumentCardTitle
                title={docname}
                shouldTruncate
              />
              <DocumentCardActivity activity="Created a few minutes ago" people={DocumentCardActivityPeople} />
            </DocumentCard>
      </Stack>
    )
  }

  function showAnalyzedDocumentResult(response: formRecoResponseRecord[] | undefined): React.ReactNode {
    if (response) {
      
      // loop through response array
      return (
        <Stack>
          {response.map((item) => {
            return (
              <Stack key={getRandomInt()}>
                <Text variant="medium"><strong>{item.key}</strong>:&nbsp;{item.val}</Text>
                <Text variant="small">Confidence:&nbsp;{item.confidence}</Text>
              </Stack>
            )
          })}
        </Stack>
      )
    }
  }
  function showUploadedDocument(): React.ReactNode {
    if (fileSelected) {
      return (
            <Stack>
              <Text variant="small">file:&nbsp;{fileSelected.name}</Text>
              <Document file={fileSelected}>
                <Page pageNumber={1}/>
              </Document>
            </Stack>
      )
    }
  }

  async function getToken():Promise<speechTokenResponse>{
    const cookie = new Cookie();
    const speechToken = cookie.get('speech-token');
    
    if (speechToken === undefined) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/plain");
  
      var requestOptions : RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };
      
      let data = await api2<speechTokenResponse>("/api/get-speech-token", requestOptions)
          .then((response) => {
            return response;
          })
          .catch(error => console.log('error', error));
    
      if (data) {
        // setSpeechToken(data);
        console.log("setting cookie..."+data.region)
        cookie.set('speech-token', data.region + ':' + data.authToken, {maxAge: 540, path: '/'});
        return data;
      }
    } else {
        console.log('Token succcessfullty fetched from cookie');
        const idx = speechToken.indexOf(':');
        return { authToken: speechToken.slice(idx + 1), region: speechToken.slice(0, idx) };
        // setSpeechToken({ authToken: speechToken.slice(idx + 1), region: speechToken.slice(0, idx) })
    }
    return {authToken:"x",region:"x"}; 
  }

  const sttFromMic = async () => {

    setRecognizing(true)

    // get the speech token (either from SDK or from Cookie)
    let speechToken  = await getToken();

    const speechConfig =
      speechsdk.SpeechTranslationConfig.fromAuthorizationToken(
        speechToken.authToken,
        speechToken.region
        
      );

    // speechConfig.speechRecognitionLanguage = "en-US";
    speechConfig.speechRecognitionLanguage = "cs-CZ";
    optionsSpeech.forEach((option) => {
      speechConfig.addTargetLanguage(option.value);
    });

    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.TranslationRecognizer(
      speechConfig,
      audioConfig
    );

    // just a debug events
    recognizer.sessionStarted =  (s: TranslationRecognizer, e: SessionEventArgs)=>{
      console.log("sessionStarted ", e)
    }
    recognizer.sessionStopped =  (s: TranslationRecognizer, e: SessionEventArgs) => {
      console.log("sessionStopped ", e)
      recognizer.close();
      setRecognizing(false)
    }
    recognizer.speechStartDetected = (s: TranslationRecognizer, e: TranslationRecognitionEventArgs) => {
      console.log("speechStartDetected ")
    }
    recognizer.speechEndDetected = (s: TranslationRecognizer, e: TranslationRecognitionEventArgs) => {
      console.log("speechEndDetected ")
      recognizer.close();
      setRecognizing(false)
    }
    recognizer.canceled = (s: TranslationRecognizer, e: TranslationRecognitionCanceledEventArgs) => {
      console.log("Cancelled ")
      recognizer.close();
      setRecognizing(false)
    }

    // recognizer.recognizing = (s, e) => {
    recognizer.recognizing = (s: TranslationRecognizer, e: TranslationRecognitionEventArgs) => {
      // console.log("recognizing ", e);
      let result = "";
      if (
        e.result.reason === ResultReason.RecognizedSpeech
      ) {
        result = `TRANSLATED: Text=${e.result.text}`;
      } else if (e.result.reason === ResultReason.NoMatch) {
        result = "NOMATCH: Speech could not be translated.";
      }
      console.log(result);
      setEN(e.result.translations.get("en"));
      setPL(e.result.translations.get("pl"));
      setUK(e.result.translations.get("uk"));
      setDisplayText(e.result.text);
    };

    // recognizer.recognized = (s, e) => {
    recognizer.recognized = (s:TranslationRecognizer, e: TranslationRecognitionEventArgs) => {
      // console.log("recognized ", e);
      setEN(e.result.translations.get("en"));
      setPL(e.result.translations.get("pl"));
      setUK(e.result.translations.get("uk"));
      setDisplayText(e.result.text);
    };

    recognizer.startContinuousRecognitionAsync();

  }


  // Speech recognition Speaker A / Speaker B
  const sttFromMicStop = async() =>{
    console.log("sttFromMicStop")
    
    if (recognizer) {
      console.log("closing scenario....")
      recognizer.stopContinuousRecognitionAsync();
      // recognizer.close();
      setRecognizing(false)
    }
  }

  const sttFromMicDoctor = async () => {

    console.log("sttFromMicDoctor")
    setRecognizing(true)
    if (recognizer) {
      // recognizer.close();
      console.log("closing....(starting doctor)")
      recognizer.stopContinuousRecognitionAsync();
      recognizer.close();
    }

    // get the speech token (either from SDK or from Cookie)
    let speechToken  = await getToken();

    const speechConfig =
      speechsdk.SpeechTranslationConfig.fromAuthorizationToken(
        speechToken.authToken,
        speechToken.region
        
      );

    // speechConfig.speechRecognitionLanguage = "en-US";
    speechConfig.speechRecognitionLanguage = "cs-CZ";
    // optionsSpeech.forEach((option) => {
    //   speechConfig.addTargetLanguage(option.value);
    // });
    speechConfig.addTargetLanguage("uk");

    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    recognizer = new speechsdk.TranslationRecognizer(
      speechConfig,
      audioConfig
    );
    // setRecognizer(new speechsdk.TranslationRecognizer(
    //     speechConfig,
    //     audioConfig
    //   ));

  
    if (recognizer) {
      // recognizer.recognizing = (s, e) => {
      recognizer.recognizing = (s: TranslationRecognizer, e: TranslationRecognitionEventArgs) => {
        // console.log("recognizing ", e);
        // let result = "";
        if (
          e.result.reason === ResultReason.RecognizedSpeech
        ) {
          // result = `TRANSLATED: Text=${e.result.text}`;
        } else if (e.result.reason === ResultReason.NoMatch) {
          // result = "NOMATCH: Speech could not be translated.";
        }
        // console.log(result);
        // setEN(e.result.translations.get("en"));
        // setPL(e.result.translations.get("pl"));
        // if (!patientSpeaking) {
          setUK(e.result.translations.get("uk"));
          setDisplayText(e.result.text);
          
        // }
      };

      // recognizer.recognized = (s, e) => {
      recognizer.recognized = (s:TranslationRecognizer, e: TranslationRecognitionEventArgs) => {
        // console.log("recognized ", e);
        // setEN(e.result.translations.get("en"));
        // setPL(e.result.translations.get("pl"));
        // if (!patientSpeaking) {
          console.log("prekladam lekare")
          setUK(e.result.translations.get("uk"));
          setDisplayText(e.result.text);
          
          addEntryClick("Doctor",e.result.translations.get("uk"), e.result.text)

        // }
      };

      recognizer.startContinuousRecognitionAsync();
    }
    
    

  }
  const sttFromMicPatient = async () => {

    console.log("sttFromMicPatient")
    setRecognizing(true)
    if (recognizer) {
      // recognizer.close();
      console.log("closing....(starting patient)")
      recognizer.stopContinuousRecognitionAsync();
      recognizer.close();
    }

    // get the speech token (either from SDK or from Cookie)
    let speechToken  = await getToken();

    const speechConfig =
      speechsdk.SpeechTranslationConfig.fromAuthorizationToken(
        speechToken.authToken,
        speechToken.region
        
      );

    // speechConfig.speechRecognitionLanguage = "en-US";
    speechConfig.speechRecognitionLanguage = "uk-UA";
    // optionsSpeech.forEach((option) => {
    //   speechConfig.addTargetLanguage(option.value);
    // });
    speechConfig.addTargetLanguage("cs");

    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    recognizer = new speechsdk.TranslationRecognizer(
      speechConfig,
      audioConfig
    );
    // setRecognizer(new speechsdk.TranslationRecognizer(
    //   speechConfig,
    //   audioConfig
    // ));

    if (recognizer) {    
      // recognizer.recognizing = (s, e) => {
      recognizer.recognizing = (s: TranslationRecognizer, e: TranslationRecognitionEventArgs) => {
        // console.log("recognizing ", e);
        // let result = "";
        if (
          e.result.reason === ResultReason.RecognizedSpeech
        ) {
          // result = `TRANSLATED: Text=${e.result.text}`;
        } else if (e.result.reason === ResultReason.NoMatch) {
          // result = "NOMATCH: Speech could not be translated.";
        }
        // console.log(result);
        // setEN(e.result.translations.get("en"));
        // setPL(e.result.translations.get("pl"));
        // setUK(e.result.translations.get("uk"));
        // if (patientSpeaking) {
          // setCS(e.result.translations.get("cs"));
          setDisplayText(e.result.text);
        // }
        
      };

      // recognizer.recognized = (s, e) => {
      recognizer.recognized = (s:TranslationRecognizer, e: TranslationRecognitionEventArgs) => {
        // console.log("recognized ", e);
        // setEN(e.result.translations.get("en"));
        // setPL(e.result.translations.get("pl"));
        // setUK(e.result.translations.get("uk"));
        // if (patientSpeaking) {
          console.log("prekladam pacienta")
          // setCS(e.result.translations.get("cs"));
          setDisplayText(e.result.text);
          
          addEntryClick("Client",e.result.translations.get("cs"),e.result.text)
        // }
      };

      recognizer.startContinuousRecognitionAsync();
    }
  }

  const onSourceChange = React.useCallback(
    (ev: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, option: IChoiceGroupOption | undefined) => {
      // console.dir(option);
      // way of translation
      if (option?.key === "l") {
          console.log("prepinam na lekare")
          setPatientSpeaking(false)
          sttFromMicDoctor()
      } else if (option?.key === "p") {
        console.log("prepinam na pacienta")
        setPatientSpeaking(true)
        sttFromMicPatient()
      } else{
        console.log("prepinam na ???")
          setPatientSpeaking(false)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [],

  );

  const onChangeLangFrom = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption<any> | undefined, index?: number | undefined): void => {
    if (item) {
      setSelectedItemLangFrom(item);
    }
  };

  const onChangeLangTo = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption<any> | undefined, index?: number | undefined): void => {
    if (item) {
      setSelectedItemLangTo(item);
    }
  };


    return (

      <Stack horizontalAlign="center" verticalAlign="start" verticalFill styles={stackStyles} tokens={stackTokens}>
      <img className="App-logo" src={logo} alt="logo" />
      <Pivot aria-label="Basic Pivot Example">
        
        <PivotItem headerText="Překlad textu">
          <Stack {...columnProps}>
            
            <Label styles={labelStyles}>Text k překladu: (Text v poli níže můžete nahradit libovolným jiným textem)</Label>
            {/* Translation */}
            <TextField label="Váš text" multiline rows={5} value={text} onChange={onTextChange} required={true} />
            
            <Dropdown placeholder="Select an option" label="Překlad z:" selectedKey={selectedItemLangFrom ? selectedItemLangFrom.key : "uk"} options={optionsLangFrom} onChange={onChangeLangFrom}  />
            <Dropdown placeholder="Select an option" label="Překlad do:" selectedKey={selectedItemLangTo ? selectedItemLangTo.key : "cs"} options={optionsLangTo} onChange={onChangeLangTo} />
            
            <PrimaryButton text="Přeložit" allowDisabledFocus disabled={uploading} checked={false} onClick={onTranslate}/>
            <Label styles={labelStyles}>Výsledek</Label>
            {/* <Text block={true} className="translated-text">{processed? translatedResults?.translations[0].text.replaceAll("<NEWLINE>","<hr>>") : ""}</Text> */}
            <TextField  multiline rows={5}  value={processed? translatedResults?.translations[0].text.replaceAll("<NEWLINE>","\n") : ""} />
          </Stack>
        </PivotItem>

{true && (
        <PivotItem headerText="Překlad dialogu">
          <Stack {...columnProps}>
           

            <ChoiceGroup label="Zvolte ikonu pro start konverzace"  options={choiceoptions} onChange={onSourceChange} />
            <PrimaryButton text="Stop" allowDisabledFocus disabled={!recognizing} checked={false} onClick={sttFromMicStop}/>

            {recognizing? <ProgressIndicator label="Mluvte..." description="překlad probíhá na pozadí do zvolených jazyků." /> : null }
            
            {recognizing? <Stack><ActivityItem key={0} activityDescription={patientSpeaking?"právě mluví pacient":"právě mluví lékař"} comments={displayText} activityPersonas={patientSpeaking?[{ imageUrl: "http://purecatamphetamine.github.io/country-flag-icons/3x2/UA.svg" }]:[{ imageUrl: "http://purecatamphetamine.github.io/country-flag-icons/3x2/CZ.svg" }]}/></Stack> : null }
            <Stack>   
            <Text variant="large">Přepis konverzace:</Text>
            {theArray.map((item: { key: string | number }) => (
              <ActivityItem {...item} className="activityItem" />
            ))}
            </Stack>
            
          </Stack>
          
        </PivotItem>
)}
{true && (
        <PivotItem headerText="Překlad dokumentu">
          <Stack {...columnProps}>
            <Label styles={labelStyles}>Nahrajte soubor v CZ (*.docx, *.pdf)</Label>
            <input  name="file" type="file" onChange={onFileChange}  />
            <Dropdown placeholder="Select an option" label="Překlad z:" selectedKey={selectedItemLangFrom ? selectedItemLangFrom.key : "uk"} options={optionsLangFrom} onChange={onChangeLangFrom}  />
            <Dropdown placeholder="Select an option" label="Překlad do:" selectedKey={selectedItemLangTo ? selectedItemLangTo.key : "cs"} options={optionsLangTo} onChange={onChangeLangTo} />
            
            <PrimaryButton text="Přeložit dokument" allowDisabledFocus disabled={uploading} checked={false} onClick={onFileUpload}/>
            {uploading? <ProgressIndicator label="Pracuji..." description="Nahrávám dokument a probíhá překlad." /> : null }
            {processedDocument? showTranslatedDocumentResult(translatedFiles) :null}
          </Stack>
          
        </PivotItem>
)}

{true && (
        <PivotItem headerText="Analýza formuláře ">
          <Stack {...columnProps}>
            <Text variant="small">V tuto chvíli je vytrénováný model pouze na SIPO formuláři.</Text>
            <Label styles={labelStyles}>Nahrajte soubor se SIPO formulářem (*.docx, *.pdf)</Label>
            <input  name="file" type="file" onChange={onFileChange}  />
            <PrimaryButton text="Analyzovat" allowDisabledFocus disabled={uploading} checked={false} onClick={onFormUploaded}/>
            {uploading? <ProgressIndicator label="Pracuji..." description="Nahrávám dokument a probíhá analýza." /> : null }
            {processedDocument? showAnalyzedDocumentResult(formRecoResults) :null}
            {(processedDocument)? showUploadedDocument(): null }

          </Stack>
          
        </PivotItem>
)}
{true && (
        <PivotItem headerText="Překlad mluveného slova">
          <Stack {...columnProps}>
            <Label styles={labelStyles}>Zmáčkněte start a začněte mluvit Česky</Label>
            <PrimaryButton text="Start" allowDisabledFocus disabled={recognizing} checked={false} onClick={sttFromMic}/>
            {recognizing? <ProgressIndicator label="Mluvte..." description="překlad probíhá na pozadí do zvolených jazyků." /> : null }
            <Stack>
              <img width="24" alt="Czechia" src="http://purecatamphetamine.github.io/country-flag-icons/3x2/CZ.svg"/>
              <Text>{displayText}</Text>
            </Stack>
            <Stack>
              <img width="24" alt="Ukraine" src="http://purecatamphetamine.github.io/country-flag-icons/3x2/UA.svg"/>
              <Text>{uk}</Text>
            </Stack>
            <Stack>
              <img width="24" alt="Poland" src="http://purecatamphetamine.github.io/country-flag-icons/3x2/PL.svg"/>
              <Text>{pl}</Text>
            </Stack>            
            <Stack>
              <img width="24" alt="English" src="http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg"/>
              <Text>{en}</Text>
            </Stack>
          </Stack>
          
        </PivotItem>
)}
      </Pivot>
      </Stack>
    );
  
}
