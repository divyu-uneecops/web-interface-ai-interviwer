export const voiceOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

export const roundTypeOptions = [
  { value: "Technical", label: "Technical" },
  { value: "Behavioral", label: "Behavioral" },
  { value: "HR Round", label: "HR Round" },
  { value: "Screening", label: "Screening" },
];

export const languageOptions = [{ value: "English", label: "English" }];

export const mapInterviewerImage = (voice: string, roundType: string) => {
  const voiceKey = voice?.toLocaleLowerCase();
  const roundTypeKey = roundType?.toLocaleLowerCase()?.replace(" ", "-");
  const map: Record<string, string> = {
    "male-technical": "/Gemini_Generated_Image_ildp20ildp20ildp.png",
    "female-technical": "/Gemini_Generated_Image_5v8ngq5v8ngq5v8n.png",
    "male-behavioral": "/Gemini_Generated_Image_iz4pqgiz4pqgiz4p.png",
    "female-behavioral": "/Gemini_Generated_Image_bgo1xsbgo1xsbgo1.png",
    "male-hr-round": "/Gemini_Generated_Image_vqt5c7vqt5c7vqt5.png",
    "female-hr-round": "/Gemini_Generated_Image_kux1xckux1xckux1.png",
    "male-screening": "/Gemini_Generated_Image_va4aetva4aetva4a.png",
    "female-screening": "/Gemini_Generated_Image_vnfqoqvnfqoqvnfq.png",
  };
  return map[`${voiceKey}-${roundTypeKey}`];
};

/** Avatar options for Select Interviewer Avatar (card-based picker) */
export const avatarOptions = [
  {
    value: "/Gemini_Generated_Image_ildp20ildp20ildp.png",
    label: "Male",
  },
  {
    value: "/Gemini_Generated_Image_5v8ngq5v8ngq5v8n.png",
    label: "Female",
  },
  {
    value: "/Gemini_Generated_Image_iz4pqgiz4pqgiz4p.png",
    label: "Male",
  },
  {
    value: "/Gemini_Generated_Image_bgo1xsbgo1xsbgo1.png",
    label: "Female",
  },
  {
    value: "/Gemini_Generated_Image_vqt5c7vqt5c7vqt5.png",
    label: "Male",
  },
  {
    value: "/Gemini_Generated_Image_kux1xckux1xckux1.png",
    label: "Female",
  },
  {
    value: "/Gemini_Generated_Image_va4aetva4aetva4a.png",
    label: "Male",
  },
  {
    value: "/Gemini_Generated_Image_vnfqoqvnfqoqvnfq.png",
    label: "Female",
  },
];
