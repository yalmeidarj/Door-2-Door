import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getConditionalClass(statusAttempt: string, consent: string) {
  switch (statusAttempt) {
    case "No Attempt":
      return "bg-gray-300 text-gray-800";
    case "Door Knock Attempt 1":
      return "bg-blue-200 text-blue-900";
    case "Door Knock Attempt 2":
      return "bg-yellow-200 text-yellow-900";
    case "Door Knock Attempt 3":
      return "bg-indigo-200 text-indigo-900";
    case "Door Knock Attempt 4":
      return "bg-orange-200 text-orange-900";
    case "Door Knock Attempt 5":
      return "bg-purple-200 text-purple-900";
    case "Door Knock Attempt 6":
      return "bg-red-200 text-red-900";
    case "Consent Final":
      if (consent.toLowerCase() == "yes") {
        return "bg-green-200 text-green-900";
      } else if (consent.toLowerCase() == "no") {
        return "bg-red-200 text-red-900";
      } else {
        return "bg-gray-200 text-gray-900";
      }
    case "Consent Final Yes":
      return "bg-green-200 text-green-900";
    case "Consent Final No":
      return "bg-red-200 text-red-900";
    case "engineer visit required":
      return "bg-teal-200 text-teal-900";
    case "Home Does Not Exist":
      return "bg-black-200 text-black-900";
    default:
      return "border-2 border-black text-blue-900";
  }
}
