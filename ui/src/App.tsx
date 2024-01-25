import { useState } from "react";
import CheckboxList from "./components/CheckboxList";
import ExitArrowIcon from "./assets/exitarrow.svg"

interface CheckboxItem {
  id: number;
  value: string;
  isChecked: boolean;
}

function App() {
  const [placeholder, setPlaceholder] = useState<string>('Enter text...');
  const [content, setContent] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const [items, setItems] = useState<CheckboxItem[]>([
    { id: 1, value: 'Summary', isChecked: true },
    { id: 2, value: 'Keywords', isChecked: true },
    { id: 3, value: 'Sentiment', isChecked: true },
  ]);

  const [summary, setSummary] = useState<string>('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [sentiment, setSentiment] = useState<number>(0);

  const getArticle = async () => {
    setLoading(true);
    setIsError(false);
    setPlaceholder('Loading...');

    try {
      const response = await fetch(`http://localhost:8080/article/${content}`);
      const data = await response.json();

      setSummary(data.summary);
      setKeywords(data.keywords);
      setSentiment(data.sentiment);
    } catch (error) {
      // setIsError(true);
      setPlaceholder('There was an error getting the article.')
    }

    setLoading(false);
  }

  const getAnalysis = async () => {
    setLoading(true);
    setIsError(false);

    try {
      const response = await fetch(`http://localhost:8080/analyze/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content }),
      });

      const data = await response.json();

      setSummary(data.summary);
      setKeywords(data.keywords);
      setSentiment(data.sentiment);
    } catch (error) {
      setIsError(true);
    }

    setLoading(false);
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
        <div className="flex flex-col space-y-2">
          <button className="w-full border rounded-md border-lime-500 p-1 hover:bg-lime-500 hover:text-white">Upload PDF</button>
          <input type="url" placeholder="Enter article URL..." className="border rounded-md border-lime-500 p-1"/>
        </div>

        {/* Checkbox List */}
        <CheckboxList items={items} setItems={setItems} />

        {/* Analyze Button */}
        <button onClick={getAnalysis} type="submit" className={`${content.trimStart() != '' && items.some((item) => item.isChecked) ? 'bg-lime-500 hover:animate-pulse' : 'disabled bg-neutral-200'} text-white rounded-md p-1 transition duration-300`}>Analyze</button>

        {/* <div className="flex-grow"></div>

        <span className="text-neutral-500">Jeff Chen © 2024</span> */}

      </div>
  
      {/* Textareas */}
      <textarea placeholder={placeholder} value={content} onChange={(e) => {setContent(e.target.value); setPlaceholder('Enter text...')}} className="shadow-inner p-2 border border-neutral-600 rounded-md w-1/3 resize-none"></textarea>
      
      <div className="shadow-inner p-2 border border-neutral-600 rounded-md w-1/3 resize-none">
        {isError && <p className="text-red-500">Error</p>}
        {loading && <p className="text-lime-500">Loading...</p>}
        {summary === '' && !loading && !isError && <p className="text-neutral-500">Output will be here...</p>}
        {summary !== '' && items[0].isChecked && (
          <>
            <h3 className="text-lg font-semibold">Summary</h3>
            <p>{summary}</p>
          </>
        )}
        {keywords.length !== 0 && items[1].isChecked && (
          <>
            <h3 className="text-lg font-semibold">Keywords</h3>
            <ul>
              {keywords.map((keyword, index) => (
                <li key={index}>{keyword}</li>
              ))}
            </ul>
          </>
        )}
        {sentiment !== 0 && items[2].isChecked && (
          <>
            <h3 className="text-lg font-semibold">Sentiment</h3>
            <p>{sentiment}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default App
