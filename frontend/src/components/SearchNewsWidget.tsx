import { useEffect } from 'react';
import closeIcon from '../assets/close.svg';

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchNewsWidget = ({setOpen} : Props) => {
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            console.log(event.key);
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };
    
        window.addEventListener('keydown', handleKeyPress);
        return () => {
          window.removeEventListener('keydown', handleKeyPress);
        };
      }, []);

    return (
        <div className="top-0 left-0 fixed z-50 w-screen h-screen backdrop- bg-neutral-900/20 flex justify-center items-center">
            <div className="w-1/2 h-3/4 bg-neutral-50 rounded-md shadow-lg relative">
                <button onClick={() => setOpen(false)} className="absolute top-2 right-2"><img src={closeIcon} className="w-6 h-6" /></button>
                <span className="absolute bottom-1/2 w-full text-center">Coming soon!</span>
            </div>
        </div>
    );
}

export default SearchNewsWidget;