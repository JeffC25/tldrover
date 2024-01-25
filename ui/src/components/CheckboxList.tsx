interface CheckboxItem {
    id: number;
    value: string;
    isChecked: boolean;
}

interface Props {
    items: CheckboxItem[];
    setItems: React.Dispatch<React.SetStateAction<CheckboxItem[]>>;
}

const CheckboxList = ({ items, setItems }: Props) => {

    const handleCheck = (id: number) => {
        const updatedItems = items.map(item => {
            if (item.id === id)
                return { ...item, isChecked: !item.isChecked };
            return item;
        });
        setItems(updatedItems);
    };

    return (
        <div className="flex flex-col space-y-2 w-min">
            {items.map(item => (
                <label key={item.id} className="flex items-center space-x-1">
                    <button 
                        onClick={() => handleCheck(item.id)}
                        className={`w-12 h-6 rounded-full p-1 flex ${item.isChecked ? 'bg-lime-500' : 'bg-gray-300'} transition duration-300`}
                    >
                        <div className={`${item.isChecked ? 'w-full' : 'w-0'} duration-300`}></div>
                        <div className={`bg-white h-full aspect-square rounded-full`}></div>
                    </button>
                    <span className=" text-neutral-800">{item.value}</span>
                </label>
            ))}
        </div>
    );

};

export default CheckboxList;