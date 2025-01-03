import React, { useEffect, useState } from 'react'
//import img from './ai-human.avif'
import img from './human-ai.png'


const App = () => {

  const [transcript, setTarnscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [information, setInformation] = useState("")
  const [voices, setvoice] = useState([])


  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

  const loadVoice = () =>{
    const allVoice = window.speechSynthesis.getVoices();
    setvoice(allVoice)
  }

  useEffect(() => {
    if(window.speechSynthesis.onvoiceschanged !== undefined){
      window.speechSynthesis.onvoiceschanged = loadVoice
    }else{
      loadVoice();
    }
  }, [])

  const startListening = () =>{
    recognition.start();
    setIsListening(true);
  }

  recognition.onresult = (event) =>{
    const spokenText = event.results[0][0].transcript.toLowerCase();
    setTarnscript(spokenText)
    handleVoiceCommand(spokenText)
  }

 recognition.onend = () =>setIsListening(false)

  const speakText = (text)=>{
    if(voices.length === 0){
      console.warn("No voice available yet.")
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    const maleEnglishVoice = voices.find((voice)=>
    voice.lang.startsWith("en-") && voice.name.toLowerCase().includes("male"))|| voices.find((voice)=>voice.lang.startsWith("en-")) ||voices[0]

    utterance.voice = maleEnglishVoice;
    utterance.lang =  maleEnglishVoice.lang || "en-US";
    utterance.rate = 1;
    utterance.pitch = 1
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance)

  }
const handleVoiceCommand = async(command)=>{
  if (command.startsWith("open")) {
    const site = command.split("open")[1].trim();

    const siteMap = {
      youtube: "https://www.youtube.com",
      facebook: "https://www.facebook.com",
      google: "https://www.google.com",
      twitter: "https://www.twitter.com",
      instagram: "https://www.instagram.com",
      uem: " https://uem.edu.in/uem-jaipur/",
      linkedin: " https://in.linkedin.com/",
    };

    if(siteMap[site]){
      speakText(`opening ${site}`);
      window.open(siteMap[site],"_blank");
      setInformation(`opened ${site}`)
    }else{
      speakText(`i don't know how to open ${site}`)
      setInformation(`could not find the website for ${site}`);
    }
    return;
  }
  if (command.includes("what is your name")) {
    const response ="Namaste sir  i'm RK  your voice assistant created by Rahul sharma"
    speakText(response)
    setInformation(response)
    return
  }else if(command.includes("hello rk")) {
    const response ="Namaste sir  i'm RK ,How can i help you"
    speakText(response)
    setInformation(response)
    return
}else if (command.includes("who is your friend")) {
  const response ="Namaste sir i have only one friend that is Rahul sharma"
  speakText(response)
  setInformation(response)
  return
}

const famousPeople = [
  "bill gates",
  "mark zuckerberg",
  "elon musk",
  "steve jobs",
  "warren buffet",
  "barack obama",
  "jeff bezos",
  "sundar pichai",
  "mukesh ambani",
  "virat kohli",
  "sachin tendulkar",
  "donald trump",
  "narayan murthy",
];
 if (famousPeople.some((person)=>command.includes(person))){
  const  person = famousPeople.find((person)=>command.includes(person))
  const personData = await fetchPersonData(person)
 
  if (personData) {
    const infoText=`${personData.name},${personData.extract}`
    setInformation(infoText)
    speakText(infoText)

    performGoogleSearch(command)
  }else{
    const fallbackMessage = "i couldn't find detailed information"
    speakText(fallbackMessage)
    performGoogleSearch(command)
  }
 }else{
  const fallbackMessage = `here is the information about${command}`;
    speakText(fallbackMessage);
    performGoogleSearch(command);
 }
}

const fetchPersonData = async(person) =>{
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(person)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.title && data.extract) {
        return{
          name:data.title,
          extract:data.extract.split('.')[0]
        }
        }else{
          return null
      }
    } catch (error) {
      console.error('error');
      return null
    }
}

const performGoogleSearch =(query)=>{
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  window.open(searchUrl,"_blank");

}

  return (
    <div>
      <div className="voice-assistant">
        <img src={img} alt="AI" className="ai-image" />
        <h2>Voice Assistant (Rk)</h2>

        <button className="btn" onClick={startListening} disabled={isListening}>
          <i className="fas fa-microphone"></i>
          {isListening ? "Listening..." : "Start Listening"}
        </button>
        <p className="tarnscript">{transcript}</p>
        <p className="information">
         {information}
        </p>
      </div>
    </div>
  );
}

export default App