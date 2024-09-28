import { useState } from 'react';

const EntryCard = ({ entry }) => {

  const [aiImageUrl, setAiImageUrl] = useState(null);

  const handleImageGeneration = async () => {
    try {
      const response = await fetch('https://gen-ai-wbs-consumer-api.onrender.com/api/v1/images/generation', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          mode: 'production',
          provider: 'open-ai',
          Authorization: import.meta.env.VITE_INTERNAL_TOKEN,
        },
        body: JSON.stringify({
          prompt: 'Generate an image of a dog',
          n: 1,
          size: "300x200"
        }),
      });

      if (!response.ok)
        {
          console.log(response);
         const whatever = await response.json();
         console.log(whatever);

          throw new Error('try');}

      else {
      const dataResult = await response.json();
      setAiImageUrl(dataResult[0].url);

     console.log(dataResult[0].url);
     console.log(dataResult)}


    } catch (error) {
      console.error(error.message);

      alert('Failed to generate AI image');
    }
  }

  return (
    <div className='card bg-base-100 shadow-xl'>
      <figure className='bg-white h-48'>
        <img src={entry.image} alt={entry.title} className='object-cover h-full w-full' />
      </figure>
      <div className='card-body h-56'>
        <h2 className='card-title'>{entry.title}</h2>
        <h3 className='font-bold'>{new Date(entry.date).toDateString()}</h3>
        <p className='truncate text-wrap'>{entry.content}</p>
      </div>
      <button onClick={handleImageGeneration} className='btn bg-indigo-600 hover:bg-indigo-700'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg> Generate new Image</button>
    </div>
  );
};

export default EntryCard;
