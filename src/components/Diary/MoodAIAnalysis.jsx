import { useRef } from 'react';
import { Charts } from '@/components/Diary';
import { useState } from 'react';
import { data } from 'autoprefixer';
import LoaderSpinner from '@/components/LoaderSpinner';

const MoodAIAnalysis = ({ entries }) => {
  const modalRef = useRef();

  const [summary, setSummary] = useState('');
  const [moodAnalysis, setMoodAnalysis] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingMood, setIsSubmittingMood] = useState(false);

  const handleAISummary = async () => {
    try {
      if (!entries.length) return alert('Please create a note first');
      const combinedEntries = entries.map(entry => entry.content).join(' ');
      setIsSubmitting(true);

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
          messages: [
            {
              role: 'user',
              content: `Write a short summary of the following diary entries:${combinedEntries}`,

            },],

        })
      }); console.log(combinedEntries), console.log(summary);
      if (!response.ok) throw new Error('Failed to generate AI summary');

      const data = await response.json();
      const summaryText = data.message.content;

      setSummary(summaryText);

    }
    catch (error) {
      console.error(error);
      alert('Failed to generate AI summary');

    }
    finally {
      setIsSubmitting(false);
    }
    console.log(data)

  };

  const handleAIMoodAnalysis = async () => {
    try {
      if (!entries.length) return alert('Please create a note first');

      const combinedEntries = entries.map(entry => entry.content).join(' ');
      setIsSubmittingMood(true);
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
          messages: [
            {
              role: 'user',
              content: `Please analyze the mood and sentiment of the following diary entries and map the moods to the categories
              1. Happy
              2. Excited
              3. Relaxed
              4. Fearful
              5. Sad
              6. Angry
              7. Disgusted

              and provide the count for the categories in the JSON Object following format:
              {Happy: 1, Excited: 9, Relaxed: 8, Fearful: 9, Sad: 8, Angry: 6, Disgusted: 6}
              And only return the object.

              Entries: ${combinedEntries}`,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error('Failed to generate AI summary');

      const data = await response.json();
      const moodAnalysisString = data.message.content;

      const moodAnalysis = JSON.parse(moodAnalysisString);

      setMoodAnalysis(moodAnalysis);

      console.log(moodAnalysis);
    } catch (error) {
      console.error(error);
      alert('Failed to generate AI summary');
    }
    finally {
      setIsSubmittingMood(false);
    }
  };

  const handleSummaryandMoodAnalysis = () => {
    handleAISummary();
    handleAIMoodAnalysis();
  }

  const handleClose = () => {
    modalRef.current.close();
    setSummary('');
    setMoodAnalysis('');
  }



  return (
    <>
      <div className='fixed bottom-4 right-4'>
        <button
          onClick={() => modalRef.current.showModal()}
          className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-2 rounded-full shadow-lg w-10 h-10 flex items-center justify-center'
        >
          ✨
        </button>
      </div>
      <dialog id='modal-note' className='modal' ref={modalRef}>
        <div className='modal-box h-[600px] py-0 w-11/12 max-w-5xl'>
          <div className='modal-action items-center justify-between mb-2'>
            <h1 className='text-2xl text-center'>Get your Summary and Mood Analysis ✨</h1>
            <form method='dialog'>
              <button className='btn' onClick={handleClose}>&times;</button>
            </form>
          </div>
          <div className='flex items-center gap-3'>
            <div className='textarea  border-indigo-600 w-1/2 h-[400px] overflow-y-scroll'>
            <h2 className='text-center text-2xl mb-2'>Summary</h2>
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
            <div className='textarea border-indigo-600 w-1/2 h-[400px] overflow-y-scroll'>
            <h2 className='text-center text-2xl mb-2'>Mood Analysis</h2>
              <>
              {isSubmittingMood ? (<LoaderSpinner />)
              : (
              <Charts moodAnalysis = {moodAnalysis}/>)}
              </>
            </div>
          </div>
          <div className='flex justify-center'>
            <button
              className='mt-5 btn bg-indigo-600 hover:bg-indigo-700 text-white'
              onClick={handleSummaryandMoodAnalysis}
            >
              Gen AI summary & mood analysis ✨
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default MoodAIAnalysis;
