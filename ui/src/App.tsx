import { useState } from "react";
import Topbar from "./components/Topbar";
import CheckboxList from "./components/CheckboxList";
import ExitArrowIcon from './assets/exitarrow.svg'

interface CheckboxItem {
  id: number;
  value: string;
  isChecked: boolean;
}

function App() {
  const [text, setText] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const [summary, setSummary] = useState<string>('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [sentiment, setSentiment] = useState<number>(0);

  const [items, setItems] = useState<CheckboxItem[]>([
    { id: 1, value: 'Summary', isChecked: true },
    { id: 2, value: 'Keywords', isChecked: true },
    { id: 3, value: 'Sentiment', isChecked: true },
  ]);

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
        <button className="bg-lime-500 text-white rounded-md p-1">Analyze</button>

      </div>

      <textarea placeholder="Enter text..." className="p-2 border border-neutral-600 rounded-md w-1/3 resize-none"></textarea>
      <textarea readOnly placeholder="Output will be here..." className="p-2 border border-neutral-600 rounded-md w-1/3 resize-none"></textarea>
    </div>
  )
}

export default App
