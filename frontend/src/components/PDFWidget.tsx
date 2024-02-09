// interface Props {
//     className?: string;
//     file: string ;
//     setContent: React.Dispatch<React.SetStateAction<string>>;
// }
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// const PDFWidget = ({ className, file, setContent }: Props) => {
    
//     const [thumbnails, setThumbnails] = useState<string[]>([]);

//     const [numPages, setNumPages] = useState<number>(1);
//     const [firstPage, setFirstPage] = useState<number>(1);
//     const [lastPage, setLastPage] = useState<number>(0);
//     const [texts, setTexts] = useState<string[]>([]);

//     useEffect(() => {
//         const fetchPDF = async () => {
//             try {
//                 const loadingTask = pdfjs.getDocument(file);
//                 const pdf = await loadingTask.promise;
//                 setNumPages(pdf.numPages);
//                 const text = await pdf.getPage(1);
//                 console.log(text.getTextContent());
//                 // Further processing...
//             } catch (error) {
//                 console.error("Error while loading PDF: ", error);
//             }
//         };

//         fetchPDF();
//     }, [file]);

//     return (
//         <div className="top-0 absolute z-50 w-screen h-screen backdrop-blur-sm bg-neutral-900/20 flex justify-center items-center">
//             <div className="w-1/2 h-3/4 bg-neutral-50 rounded-md shadow-lg">
//                 {/* Render the thumbnails */}
//                 {/* {thumbnails.map((thumbnail, index) => (
//                     <img key={index} src={thumbnail} alt={`Thumbnail ${index + 1}`} />
//                 ))} */}
//             </div>
//         </div>
//     );
// }

// export default PDFWidget;
