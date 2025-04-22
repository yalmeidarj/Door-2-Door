"use client";
import { useState, useEffect } from "react";
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
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type FormProps = {
    userId: string;
    houseId: Id<"house">;
    shiftId: string;
    info: {
        streetNumber: string;
        streetName: string;
        locationName: string;
        notes: string;
    };
    house: any; // Accept the full house object
};

export default function Form({ userId, houseId, info, shiftId, house }: FormProps) {
    const constructionTypes = ["Easy", "Moderate", "Hard"];
    const createNewEditByHouseId = useMutation(api.houseEditLog.createNewEditByHouseId)
    const updateShift = useMutation(api.shiftLogger.incrementShiftCounter)
    const incrementUpdatedHouses = useMutation(api.shiftLogger.incrementUpdatedHouses)
    const incrementUpdatedHousesFinal = useMutation(api.shiftLogger.incrementUpdatedHousesFinal)
    const incrementUpdatedHousesFinalNo = useMutation(api.shiftLogger.incrementUpdatedHousesFinalNo)

    // State for all fields
    const [propertyId, setPropertyId] = useState(houseId.toString());
    const [agentId] = useState(userId);
    const [agent, setAgentName] = useState("No Agent Name");

    const [currentShiftId, setCurrentShiftId] = useState<string>(shiftId);

    // Use house.type as the initial value if available
    const [typeValue, setTypeValue] = useState<string>(house?.type || " ");
    const [selectedStatus, setSelectedStatus] = useState<string>(house?.statusAttempt || " ");

    const [name, setName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [field, setField] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    // const [notes, setNotes] = useState<string>("");
    const [newNotes, setNewNotes] = useState<string>("");

    // State to track if the form has been modified
    const [isFormModified, setIsFormModified] = useState<boolean>(false);

    // Check if any field has been modified
    useEffect(() => {
        // We only need to detect if any field has a value that would change the current house data
        const hasChanges =
            (name !== "" && name !== house?.name) ||
            (lastName !== "" && lastName !== house?.lastName) ||
            (email !== "" && email !== house?.email) ||
            (phone !== "" && phone !== house?.phone) ||
            (newNotes !== "" && newNotes !== house?.notes) ||
            (typeValue !== " " && typeValue !== house?.type) ||
            (selectedStatus !== " " && selectedStatus !== house?.statusAttempt);

        setIsFormModified(hasChanges);
    }, [name, lastName, email, phone, newNotes, typeValue, selectedStatus, house]);

    async function clientAction() {
        // Create base object with required fields
        const baseObject = {
            houseId: propertyId,
            agentId: agentId,
            shiftId: shiftId,
        };

        // Prepare field values - use current input or existing house data if not modified
        const fieldValues = {
            type: typeValue.trim() !== " " ? typeValue.trim() : house?.type || "",
            statusAttempt: selectedStatus.trim() !== " " ? selectedStatus.trim() : house?.statusAttempt || "",
            lastName: lastName.trim() !== "" ? lastName.trim() : house?.lastName || "",
            name: name.trim() !== "" ? name.trim() : house?.name || "",
            phone: phone.replace(/\D/g, "") !== "" ? phone.replace(/\D/g, "") : house?.phone || "",
            email: email.trim() !== "" ? email.trim() : house?.email || "",
            // Only include notes if newNotes is not empty
        };

        // Only add notes to fieldValues if something was entered
        if (newNotes.trim() !== "") {
            (fieldValues as any).notes = newNotes.trim();
        }

        // Filter out empty values and create final object
        const newObject = Object.entries(fieldValues).reduce<typeof baseObject>((acc, [key, value]) => {
            if (value !== "") {
                (acc as any)[key] = value;
            }
            return acc;
        }, baseObject);

        if (selectedStatus === "Consent Final Yes") {
            const result = ConsentYesSchema.safeParse(newObject);
            if (result.success) {
                const houseUpdate = await createNewEditByHouseId(newObject);
                if (houseUpdate) {
                    toast.success("House Updated Successfully");
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
        setTypeValue(house?.type || " ");  // Reset to house.type if available
        setSelectedStatus(" ");
        setName("");
        setLastName("");
        setCurrentShiftId("");
        setEmail("");
        setPhone("");
        setNewNotes("");
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
                className="py-4  w-full sm:p-6 md:p-8 bg-gray-100 shadow-lg rounded-lg"
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
                        <span className="font-bold text-4xl">{info.streetNumber}</span>
                        <span className="font-medium text-lg">{info.streetName}</span>
                    </div>

                    <div className="w-full flex flex-col justify-between h-full gap-4">
                        <div>
                            <RadioGroup
                                name="type"
                                value={typeValue}
                                onValueChange={(val) => setTypeValue(val)}
                            >
                                <div className="flex flex-row items-center mx-3 sm-w-full justify-between">
                                    {constructionTypes.map((option) => (
                                        <div key={option} className="flex flex-col  items-center">
                                            <Label htmlFor={option}>{option.slice(0, 4)}</Label>
                                            <RadioGroupItem value={option} id={option} />
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>
                        </div>
                        <Separator orientation="horizontal" />
                        <div className="w-full ">
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
                        placeholder={house?.name || "Enter name"}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <FormItem
                        label="Last Name"
                        input="lastName"
                        type="text"
                        value={lastName}
                        placeholder={house?.lastName || "Enter last name"}
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
                        placeholder={house?.email || "Enter email"}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <PhoneInput
                        value={phone}
                        placeholder={house?.phone || "Enter phone number"}
                        onChange={(newPhone) => setPhone(newPhone)}
                    />
                </div>

                {/* Notes Section */}
                <div className="mb-6">
                    <Textarea
                        placeholder="Add new note..."
                        id="notes"
                        name="notes"
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                    />
                </div>

                <div className="flex justify-end">
                    <SubmitFormButton title="Update property" disabled={!isFormModified} />
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
    placeholder,
    size,
}: {
    label: string;
    input: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    size?: number;
}) {
    return (
        <Input
            type={type}
            id={input}
            name={input}
            placeholder={placeholder || label}
            size={size}
            autoComplete="off"
            className="focus:ring-indigo-500"
            value={value}
            onChange={onChange}
        />
    );
}