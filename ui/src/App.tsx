import { useState } from "react";
import Topbar from "./components/Topbar";
import CheckboxList from "./components/CheckboxList";

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
    <div className=" h-screen w-screen">
      <Topbar />

      <div className="flex h-2/3 space-x-2 p-2 justify-center pt-20">
        <div className="flex flex-col space-y-2 w-min ">
          <button className="border rounded-md border-lime-500 p-1 hover:bg-lime-500 hover:text-white">Upload PDF</button>
          <input type="url" placeholder="Enter article URL..." className="border rounded-md border-lime-500 p-1"/>
          <CheckboxList items={items} setItems={setItems} />
        </div>

        <textarea placeholder="Enter text..." className="p-2 border border-neutral-600 rounded-md w-1/3 resize-none"></textarea>
        <textarea readOnly placeholder="Output will be here..." className="p-2 border border-neutral-600 rounded-md w-1/3 resize-none"></textarea>
      </div>
      <div className="w-full flex justify-center">
        <button className="bg-lime-500 text-white rounded-md shadow-md p-2 text-xl">Analyze</button>
      </div>

    </div>
  )
}

export default App
