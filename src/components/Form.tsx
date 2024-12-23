"use client";
import {  useState } from "react";
import SubmitFormButton from "./SubmitFormButton";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ConsentYesSchema, FormSchema } from "@/lib/houses/types";
import PhoneInput from "./PhoneInput";
import { statusOptions } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type FormProps = {
    userId: string;
    houseId: number;
    shiftId: string;
    info: {
        streetNumber: string;
        streetName: string;
        locationName: string;
        notes: string;
    };
};

export default function Form({ userId, houseId, info, shiftId  }: FormProps) {    

    const constructionTypes = ["Easy", "Moderate", "Hard"];
    const createNewEditByHouseId = useMutation(api.houseEditLog.createNewEditByHouseId)
    const updateShift = useMutation(api.shiftLogger.incrementShiftCounter)
    const incrementUpdatedHouses = useMutation(api.shiftLogger.incrementUpdatedHouses)
    const incrementUpdatedHousesFinal  = useMutation(api.shiftLogger.incrementUpdatedHousesFinal)
    const incrementUpdatedHousesFinalNo = useMutation(api.shiftLogger.incrementUpdatedHousesFinalNo)
    // State for all fields
    const [propertyId, setPropertyId] = useState(houseId.toString());
    const [agentId] = useState(userId);
    const [agent, setAgentName] = useState("No Agent Name");
    
    const [currentShiftId, setCurrentShiftId] = useState<string>(shiftId);

    const [typeValue, setTypeValue] = useState<string>(" ");
    const [selectedStatus, setSelectedStatus] = useState<string>(" ");

    const [name, setName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [field, setField] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [notes, setNotes] = useState<string>("");

    async function clientAction() {
        // Create base object with required fields
        const baseObject = {
            houseId: propertyId,
            agentId: agentId,
            shiftId: shiftId,
        };

        // Add optional fields only if they have non-empty values
        const optionalFields: Record<string, string> = {
            type: typeValue.trim(),
            statusAttempt: selectedStatus.trim(),
            lastName: lastName.trim(),
            name: name.trim(),
            phone: phone.replace(/\D/g, ""),
            email: email.trim(),
            notes: notes.trim(),
        };

        // Filter out empty values and create final object
        const newObject = Object.entries(optionalFields).reduce((acc, [key, value]) => {
            if (value && value !== " ") {
                acc[key ] = value ;
            }
            return acc;
        }, baseObject);

        if (selectedStatus === "Consent Final Yes") {
            const result = ConsentYesSchema.safeParse(newObject);
            if (result.success) {                
                const houseUpdate = await createNewEditByHouseId(newObject);
                if (houseUpdate) {
                    toast.success("House Updated Successfully");
                    // const shift = await updateShift({
                    //     id: shiftId as Id<"shiftLogger">,
                    //     field: field
                    // });
                    const shift = await incrementUpdatedHousesFinal({
                        id: shiftId as Id<"shiftLogger">
                    })
                    if (shift) {
                        toast.success("Updated shift");
                        handleFormReset();
                        return true;
                    }
                }
                handleFormReset();
                return true;
            } else {
                console.log(result.error.issues);
                toast.error(result.error.issues[0].message.toString());
                return false;
            }
        } else {
            const result = FormSchema.safeParse(newObject);
            if (result.success) {
                const houseUpdate = await createNewEditByHouseId(newObject);
                if (houseUpdate) {
                    toast.success("House Updated Successfully");
                    let shift = null
                    if (selectedStatus === "Consent Final No") {
                        
                        shift = await incrementUpdatedHousesFinalNo({
                            id: shiftId as Id<"shiftLogger">
                        })
                    } else {
                        shift = await incrementUpdatedHouses({
                            id: shiftId as Id<"shiftLogger">
                        })
                    }
                    // const shift = await updateShift({
                    //     id: shiftId as Id<"shiftLogger">,
                    //     field: field
                    // });
                    if (shift) {
                        toast.success("Updated shift");
                        handleFormReset();
                        return true;
                    }
                }
                handleFormReset();
                return true;
            } else {
                toast.error(result.error.issues[0].code);
                console.log(result.error.issues);
                return false;
            }
        }
    }

    const handleFormReset = () => {
        // Reset all fields to initial states
        setPropertyId(houseId.toString());
        setAgentName("No Agent Name");
        setTypeValue(" ");
        setSelectedStatus(" ");
        setName("");
        setLastName("");
        setCurrentShiftId("");
        setEmail("");
        setPhone("");
        setNotes("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {        
        if (selectedStatus === "Consent Final Yes") {
            setField("updatedHousesFinal");
        } else if (selectedStatus === "Consent Final No") {
            setField("updatedHousesFinalNo");
        } else {
            setField("updatedHouses");
        }
        e.preventDefault();
        await clientAction();
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="p-4 mx-auto w-full sm:p-6 md:p-8 bg-gray-100 shadow-lg rounded-lg"
            >
                {/* Hidden Inputs */}
                <input type="hidden" id="id" name="id" value={propertyId} readOnly />
                <input type="hidden" id="field" name="field" value={field} readOnly />
                <input type="hidden" id="shiftId" name="shiftId" value={currentShiftId} readOnly />
                <input type="hidden" id="agentName" name="agentName" value={agent} readOnly />
                <input type="hidden" id="agentId" name="agentId" value={agentId} readOnly />
                <input type="hidden" id="currentNotes" name="currentNotes" value={info.notes} readOnly />

                {/* Attempt Number Section */}
                <div className="grid grid-cols-2 gap-6 h-full mb-12">
                    <div
                        className="flex flex-col h-full items-start w-full justify-between
                     bg-gray-200 text-slate-600 border-slate-300 border-dotted border-2 rounded-md px-2 py-2"
                    >
                        <span className="font-bold text-4xl"> {info.streetNumber}</span>
                        <span className="font-medium text-lg"> {info.streetName}</span>
                    </div>

                    <div className="w-full flex flex-col justify-between h-full gap-4">
                        <div>
                            <RadioGroup
                                name="type"
                                value={typeValue}
                                onValueChange={(val) => setTypeValue(val)}
                            >
                                <div className="flex flex-row items-center gap-8 sm-w-full justify-between">
                                    {constructionTypes.map((option) => (
                                        <div key={option} className="flex flex-col  items-center  px-1">
                                            <Label htmlFor={option}>{option.slice(0, 4)}</Label>
                                            <RadioGroupItem value={option} id={option} />
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>
                        </div>
                        <Separator orientation="horizontal" />
                        <div className="w-full">
                            <Select
                                value={selectedStatus}
                                onValueChange={(value) => setSelectedStatus(value)}
                                name="statusAttempt"
                            >
                                <SelectTrigger id="statusAttempt" name="statusAttempt" className="w-full">
                                    <SelectValue placeholder={selectedStatus || "Status Attempt"} />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem key=" " value={" "}>
                                        Status Attempt
                                    </SelectItem>
                                    {statusOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Home owner Info Section */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <FormItem
                        label="Name"
                        input="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <FormItem
                        label="Last Name"
                        input="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                {/* Email and Phone Section */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <FormItem
                        label="Email"
                        input="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <PhoneInput
                        value={phone}
                        onChange={(newPhone) => setPhone(newPhone)}
                    />
                </div>

                {/* Notes Section */}
                <div className="mb-6">
                    <Textarea
                        placeholder={"Type your notes here..."}
                        id="notes"
                        name="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <div className="flex justify-end">
                    <SubmitFormButton title="Update property" />
                </div>
            </form>
        </>
    );
}

function FormItem({
    label,
    input,
    type,
    value,
    onChange,
    size,
}: {
    label: string;
    input: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    size?: number;
}) {
    return (
        <Input
            type={type}
            id={input}
            name={input}
            placeholder={label}
            size={size}
            autoComplete="off"
            className="focus:ring-indigo-500"
            value={value}
            onChange={onChange}
        />
    );
}



