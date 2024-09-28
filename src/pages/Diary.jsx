import { useEffect, useState } from 'react';
import axios from 'axios';
import { CreateEntry, MoodAIAnalysis, EntriesList } from '@/components/Diary';
import { toast } from 'react-toastify';

const Diary = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_NOTES_API}/entries`);
        setEntries(data);
      } catch (error) {
        toast.error(error.message);
      }
    })();
  }, []);

  return (
    <>
      <EntriesList entries={entries} />
      <CreateEntry setEntries={setEntries} />
      <MoodAIAnalysis entries={entries} />
    </>
  );
};

export default Diary;
