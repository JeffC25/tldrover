import { useState } from "react";
import CheckboxList from "./components/CheckboxList";
import ExitArrowIcon from "./assets/exitarrow.svg"
import SpinnerIcon from "./assets/spinner.svg"

interface CheckboxItem {
  id: number;
  value: string;
  isChecked: boolean;
}

interface Sentiment {
  label: string;
  score: number;
}

function App() {
  const [placeholder, setPlaceholder] = useState<string>('Enter text...');
  const [content, setContent] = useState<string>('');
  const [url, setUrl] = useState<string>('');

  const [loadingInput, setLoadingInput] = useState<boolean>(false);
  const [loadingInputStatus, setLoadingInputStatus] = useState<string>('');
  const [loadingOutput, setLoadingOutput] = useState<boolean>(false);
  const [loadingOutputStatus, setLoadingOutputStatus] = useState<string>('');

  const [summaryError, setSummaryError] = useState<boolean>(false);
  const [keywordsError, setKeywordsError] = useState<boolean>(false);
  const [sentimentError, setSentimentError] = useState<boolean>(false);

  const [items, setItems] = useState<CheckboxItem[]>([
    { id: 1, value: 'Summary', isChecked: false },
    { id: 2, value: 'Sentiment', isChecked: false },
    { id: 3, value: 'Keywords', isChecked: false },
  ]);

  const [summary, setSummary] = useState<string>('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [sentiment, setSentiment] = useState<Sentiment>({label: '', score: 0});

  const fetchArticle = async () => {
    setSummary('');
    setKeywords([]);
    setSentiment({label: '', score: 0});
    setLoadingInput(true);

    try {
      setLoadingInputStatus("Extracting article...");
      const response = await fetch(`http://localhost:8000/article?url=${url.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setContent(data.content);
      setPlaceholder('Enter text...');
    } catch (error) {
      console.error('Error getting article:', error);
      setPlaceholder('There was an error getting the article.')
      setContent('');
    }

    setLoadingInput(false);
  }

  const fetchFile = async (file: File) => {
    setSummary('');
    setKeywords([]);
    setSentiment({label: '', score: 0});
    setLoadingInput(true);

    // Create a FormData object and append the file
    const formData = new FormData();
    if (file) {
        formData.append('file', file);
    }

    try {
        setLoadingInputStatus("Extracting file...");
        const response = await fetch(`http://localhost:8000/file/`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setContent(data.content);

        setPlaceholder('Enter text...');
    } catch (error) {
        console.error('Error uploading file:', error);
        setPlaceholder('There was an error extracting the text.');
        setContent('');
    }

    setLoadingInput(false);
}

  const fetchAnalysis = async () => {
    setSummary('');
    setKeywords([]);
    setSentiment({label: '', score: 0});

    setLoadingOutput(true);

    setSummaryError(false);
    setKeywordsError(false);
    setSentimentError(false);

    if (items[2].isChecked) {
      try {
        setLoadingOutputStatus("Extracting keywords...");
        const response = await fetch('http://localhost:8000/keywords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text: content,
              minScore: 0.9
            })
        });
        const data = await response.json();
        if (!response.ok) {
          setKeywordsError(true);
        }
        setKeywords(data.keywords);
      } catch (error) {
        console.error('Error extracting keywords:', error);
        setKeywordsError(true);
      }
    }

    if (items[1].isChecked) {
      try {
        setLoadingOutputStatus("Analyzing sentiment...");
        const response = await fetch('http://localhost:8000/sentiment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text: content
            })
        });
        const data = await response.json();
        if (!response.ok) {
          setSentimentError(true);
        }
        setSentiment({label: data.label, score: data.score});
      } catch (error) {
        console.error('Error analyzing sentiment:', error);
        setSentimentError(true);
      }
    }

    if (items[0].isChecked) {
      try {
        setLoadingOutputStatus("Generating summary...");
        const response = await fetch('http://localhost:8000/summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text: content
            })
        });
        const data = await response.json();
        if (!response.ok) {
          setSummaryError(true);
        }
        setSummary(data.summary);
      } catch (error) {
        console.error('Error extracting summary:', error);
        setSummaryError(true);
      }
    }

    setLoadingOutput(false);
  }

  return (

    <div className="flex h-screen w-screen space-x-6 justify-center p-8 sm:p-20">
      <div className="flex flex-col space-y-6 w-min">

        {/* Heading and GitHub Link */}
        <div className="flex flex-col">
          <h1 className="sm:text-4xl font-bold w-min">
              <span className="text-neutral-700">TLD</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-500 to-lime-600">Rover</span>
          </h1>

          <a href="https://github.com/jeffc25/tldrover" target="_blank" className="flex items-center w-min hover:animate-pulse">
              <span className="sm:text-xl">GitHub</span>
              <img src={ExitArrowIcon} className="inline-block w-6 h-6" alt="exit arrow" />
          </a>
        </div>

        {/* PDF and URL Input */}
        <div className="w-full flex flex-col space-y-2">
          <form className="w-full border rounded-md border-lime-500 hover:bg-lime-500 hover:text-white duration-300 flex">
            <label htmlFor="file" className="h-full flex-grow p-1 rounded-md cursor-pointer">Upload PDF</label>
            <input type="file" id="file" onChange={(e) => {e.target.files && e.target.files.length > 0 && fetchFile(e.target.files[0])}} className="invisible py-0 h-0 w-0"/>
          </form>

          <form onSubmit={(e) => {e.preventDefault(); fetchArticle(); (e.target as HTMLFormElement).reset()}} className="w-full rounded-md flex-shrink-0 flex flex-col space-y-2">
            <input type="url" id="url" onChange={(e) => setUrl(e.target.value)} placeholder="Enter article URL..." autoComplete="off" className=" p-1 rounded-md focus:outline-none border border-lime-500 "/>
            <button type="submit" className={`${url.trimStart() != '' ? 'bg-lime-500 hover:animate-pulse' : 'disabled bg-neutral-200'} text-white rounded-md p-1 transition duration-300`}>Extract Text</button>
          </form>     
        </div>

        {/* Checkbox List */}
        <CheckboxList items={items} setItems={setItems} />

        {/* Analyze Button */}
        <button onClick={fetchAnalysis} type="submit" className={`${content.trimStart() != '' && items.some((item) => item.isChecked) ? 'bg-lime-500 hover:animate-pulse' : 'disabled bg-neutral-200'} text-white rounded-md p-1 transition duration-300`}>Analyze</button>
        
        {/* <div className="flex-grow"></div>

        <span className="text-neutral-300 text-right font-semibold">Jeff Chen © 2024</span> */}

      </div>
  
      {/* Input */}
      <div className="relative shadow-inner border border-neutral-400 rounded-md w-1/3">
        {loadingInput 
        ? <div className="absolute top-0 left-0 pb-20 flex flex-col justify-center items-center h-full w-full bg-white">
            <img className="aspect-square h-1/6 w-1/6 animate-spin block" src={SpinnerIcon}/>
            {loadingInputStatus && <span className="text-neutral-500 block w-full text-center">{loadingInputStatus}</span>}
          </div>
        : <textarea placeholder={placeholder} value={content} onChange={(e) => {setContent(e.target.value); setPlaceholder('Enter text...')}} className="w-full h-full resize-none p-4 rounded-md focus:outline-none"></textarea>}
      </div>
      
      {/* Output */}
      <div className={`relative shadow-inner p-4 border border-neutral-400 rounded-md w-1/3 resize-none overflow-y-auto`}>
        {loadingOutput && 
          <div className="absolute top-0 left-0 pb-20 flex flex-col justify-center items-center h-full w-full bg-white">
            <img className="aspect-square h-1/6 w-1/6 animate-spin block" src={SpinnerIcon}/>
            {loadingOutputStatus && <span className="text-neutral-500 block w-full text-center">{loadingOutputStatus}</span>}
          </div>
        }
        {summary.length == 0 && keywords.length == 0 && sentiment.label == '' && !loadingOutput && !summaryError && !keywordsError && !sentimentError && <p className="text-neutral-500">Output will be here...</p>}
        {summary && (
          <>
            <h3 className="text-lg font-semibold">Summary</h3>
            <p className="mb-6">{summary}</p>
          </>
        )}
        {sentiment.label && (
          <>
            <h3 className="text-lg font-semibold">Sentiment</h3>
            <p className="mb-6">{sentiment.label.charAt(0).toUpperCase() + sentiment.label.slice(1)}</p>
          </>
        )}
        {keywords && keywords.length != 0 && (
          <>
            <h3 className="text-lg font-semibold">Keywords</h3>
            <ul className="mb-6">
              {keywords.map((keyword, index) => (
                <li key={index}>• {keyword}</li>
              ))}
            </ul>
          </>
        )}
        {summaryError && <span className="text-red-500 block">There was an error generating your summary</span>}
        {sentimentError && <span className="text-red-500 block">There was an error analyzing the sentiment</span>}
        {keywordsError && <span className="text-red-500 block">There was an error extracting the keywords</span>}
      </div>
    </div>
  )
}

export default App
