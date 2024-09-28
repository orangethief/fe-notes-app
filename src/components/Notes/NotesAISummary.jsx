import { useRef, useState } from 'react';
import LoaderSpinner from '@/components/LoaderSpinner';

const NotesAISummary = ({ notes }) => {
  const modalRef = useRef();
  const resultsRef = useRef();
  const [stream, setStream] = useState(false);
  const [summary, setSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAISummary = async (e) => {
    e.preventDefault();

    if (!notes.length) return alert('Please create a note first');
    const combinedEntries = notes.map(entry => entry.content).join(' ');
    setSummary('');


    try {
      setIsSubmitting(true);
      console.log("stream", stream);
      const response = await fetch('https://gen-ai-wbs-consumer-api.onrender.com/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          mode: 'production',
          provider: 'open-ai',
          Authorization: import.meta.env.VITE_INTERNAL_TOKEN,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          stream: stream,
          messages: [
            {
              role: 'user',
              content: `Write a summary of the following school notes: ${combinedEntries}`,
            },
          ],
        }),
      });

      console.log(combinedEntries);

      if (!response.ok) throw new Error('Failed to generate AI summary');

      if (stream) {
        setIsSubmitting(false);
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let dataResult = '';
        let isDone = false;

        while (!isDone) {
          const result = await reader.read();
          if (result.done) {
            isDone = true;
            break;
          }

          const chunk = decoder.decode(result.value, { stream: true });
          const lines = chunk.split('\n');
          lines.forEach(line => {
            if (line.startsWith('data:')) {
              const jsonStr = line.replace('data:', '');
              const data = JSON.parse(jsonStr);
              const content = data.choices[0]?.delta?.content;
              if (content) {
                dataResult += content;
                setSummary(dataResult);
                console.log(dataResult);
              }
            }
          });
          }
      } else {
        const dataResult = await response.json();
        setSummary(dataResult.message?.content || 'No response');
        console.log(dataResult);
      }

    } catch (error) {
      console.error(error);
      alert('Failed to generate AI summary');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleClose = () => {
    modalRef.current.close();
    setSummary('');
  }

  return (
    <>
      <div className='fixed bottom-4 right-4'>
        <button
          onClick={() => modalRef.current.showModal()}
          className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-lg w-10 h-10 flex items-center justify-center'
        >
          ✨
        </button>
      </div>
      <dialog id='modal-note' className='modal' ref={modalRef}>
        <div className='modal-box h-[600px] py-0'>
          <div className='modal-action items-center justify-between mb-2'>
            <h1 className='text-2xl text-center'>Get AI Gen summary</h1>
            <label htmlFor='Stream?' className='flex items-center gap-1'>
              Stream?
              <input
                id='Stream?'
                type='checkbox'
                className='toggle toggle-primary'
                checked={stream}
                onChange={() => setStream(p => !p)}
              />
            </label>

            <form method='dialog'>
              <button className='btn' onClick={handleClose}>&times;</button>
            </form>
          </div>
          <div className='flex flex-col items-center gap-3'>
            <div
              className='textarea border-indigo-600 w-full h-[400px] overflow-y-scroll'
              ref={resultsRef}
            >
              <>
              {isSubmitting ? (<LoaderSpinner />
              ) : (
              summary && (
              <>
                <p>{summary}</p>
              </>)
              )}
              </>
            </div>
            <button
              className='mt-5 btn bg-indigo-600 hover:bg-indigo-700 text-white'
              onClick={handleAISummary}
              disabled={isSubmitting}
            >
              Gen AI summary ✨
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NotesAISummary;
