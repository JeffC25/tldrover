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
  // const [file, setFile] = useState<File | null>();

  const [loadingInput, setLoadingInput] = useState<boolean>(false);
  const [loadingOutput, setLoadingOutput] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const [items, setItems] = useState<CheckboxItem[]>([
    { id: 1, value: 'Summary', isChecked: true },
    { id: 2, value: 'Keywords', isChecked: true },
    { id: 3, value: 'Sentiment', isChecked: true },
  ]);

  const [summary, setSummary] = useState<string>('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [sentiment, setSentiment] = useState<Sentiment>({label: '', score: 0});

  const fetchArticle = async () => {
    console.log(url);
    setIsError(false);
    setLoadingInput(true);
    // setPlaceholder('Loading...');

    try {
      const response = await fetch(`http://localhost:8000/article?url=${url}`);
      const data = await response.json();

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
    setIsError(false);
    setLoadingInput(true);

    // Create a FormData object and append the file
    const formData = new FormData();
    if (file) {
        formData.append('file', file);
    }

    try {
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
    setLoadingOutput(true);
    setIsError(false);

    try {
      const response = await fetch(`http://localhost:8000/analyze/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content, summary: items[0].isChecked, keywords: items[1].isChecked, sentiment: items[2].isChecked}),
      });

      const data = await response.json();

      setSummary(data.summary || '');
      setKeywords(data.keywords || []);
      setSentiment(data.sentiment || {label: '', score: 0});
    } catch (error) {
      console.error('Error analyzing text:', error);
      setIsError(true);
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
          <form className="w-full border rounded-md border-lime-500 hover:bg-lime-500 hover:text-white flex">
            <label htmlFor="file" className="h-full flex-grow p-1 rounded-md cursor-pointer">Upload PDF</label>
            <input type="file" id="file" onChange={(e) => {e.target.files && e.target.files.length > 0 && fetchFile(e.target.files[0])}} className="invisible py-0 h-0 w-0"/>
          </form>

          <form onSubmit={(e) => {e.preventDefault(); fetchArticle()}} className="w-full border rounded-md flex-shrink-0 border-lime-500 ">
            <input type="url" id="url" onChange={(e) => setUrl(e.target.value)} placeholder="Enter article URL..." className="h-full p-1 rounded-md focus:outline-none"/>
          </form>
        </div>

        {/* Checkbox List */}
        <CheckboxList items={items} setItems={setItems} />

        {/* Analyze Button */}
        <button onClick={fetchAnalysis} type="submit" className={`${content.trimStart() != '' && items.some((item) => item.isChecked) ? 'bg-lime-500 hover:animate-pulse' : 'disabled bg-neutral-200'} text-white rounded-md p-1 transition duration-300`}>Analyze</button>
        
        {/* <div className="flex-grow"></div>

        <span className="text-neutral-500">Jeff Chen © 2024</span> */}

      </div>
  
      {/* Input */}
      <div className="relative shadow-inner border border-neutral-600 rounded-md w-1/3">
        {loadingInput 
        ? <div className="absolute flex justify-center items-center w-full h-full"><img className="aspect-square h-1/6 w-1/6 animate-spin" src={SpinnerIcon}/></div> 
        : <textarea placeholder={placeholder} value={content} onChange={(e) => {setContent(e.target.value); setPlaceholder('Enter text...')}} className="w-full h-full resize-none p-2 rounded-md focus:outline-none"></textarea>}
      </div>
      
      {/* Output */}
      <div className={`relative shadow-inner p-2 border border-neutral-600 rounded-md w-1/3 resize-none`}>
        {isError && <span className="text-red-500">Error</span>}
        {loadingOutput && <div className="absolute flex justify-center items-center w-full h-full"><img className="aspect-square h-1/6 w-1/6 animate-spin" src={SpinnerIcon}/></div>}
        {summary.length == 0 && keywords.length == 0 && sentiment.label == '' && !loadingOutput && !isError && <p className="text-neutral-500">Output will be here...</p>}
        {summary && (
          <>
            <h3 className="text-lg font-semibold">Summary</h3>
            <p className="mb-6">{summary}</p>
          </>
        )}
        {keywords && keywords.length != 0 && (
          <>
            <h3 className="text-lg font-semibold">Keywords</h3>
            <ul className="mb-6">
              {keywords.map((keyword, index) => (
                <li key={index}>{keyword}</li>
              ))}
            </ul>
          </>
        )}
        {sentiment.label && (
          <>
            <h3 className="text-lg font-semibold">Sentiment</h3>
            <p className="mb-6">{sentiment.label}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default App
