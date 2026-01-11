import { useState, useCallback } from "react";

export const useSkillsManager = (
  skills: string[],
  onUpdate: (skills: string[]) => void
) => {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = useCallback(() => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      onUpdate([...skills, trimmedSkill]);
      setNewSkill("");
    }
  }, [newSkill, skills, onUpdate]);

  const removeSkill = useCallback(
    (skillToRemove: string) => {
      onUpdate(skills.filter((skill) => skill !== skillToRemove));
    },
    [skills, onUpdate]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSkill();
      }
    },
    [addSkill]
  );

  return {
    newSkill,
    setNewSkill,
    addSkill,
    removeSkill,
    handleKeyDown,
  };
};
