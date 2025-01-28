"use client"
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface User {
    _id: string;
    _creationTime: number;
    name?: string;
    email: string;
    role?: "dev" | "admin" | "user";
    userId?: string;
    emailVerified?: number;
    image?: string;
    organizationId?: string;
}



interface OrgAccessRequest {
    _id: string;
    _creationTime: number;
    name: string;
    email: string;
    status?: "pending" | "accepted" | "cancelled";
    userId?: string;
}

export default function NewUserRequests() {
    const updateUser = useMutation(api.users.updateUser);
    const deleteRequest = useMutation(api.orgAccessRequest.deleteOrgAccessRequestById);
    const updateOrgAccessRequestById = useMutation(api.orgAccessRequest.updateOrgAccessRequestById);
    const pathName = usePathname();
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");
    const orgId = useQuery(api.organization.getOrgByName, { name: orgName })?._id;
    const orgAccessRequests = useQuery(api.orgAccessRequest.getAllPendingRequestsByOrgId, { orgId: orgId as Id<"organization"> });

    // State to track proposed status changes
    const [proposedStatuses, setProposedStatuses] = useState<Record<string, "pending" | "accepted" | "cancelled">>({});

    if (!orgAccessRequests) {
        return <div>Finding Access Requests: {orgName}...</div>;
    }

    const handleStatusChange = async (
        userId: string,
        status: string,
        requestId?: string,
        orgId?: string
    ) => {
        try {
            // Construct the update payload
            if (status === "accepted") {
                console.log("STATUS -----> ",status)
                // updatePayload.organizationId = orgId as Id<"organization">;
                await updateUser({ id:userId as Id<"users">, organizationId: orgId as Id<"organization"> });
                await deleteRequest({ id: requestId as Id<"orgAccessRequest"> });
            } else {
                await updateOrgAccessRequestById({ id: requestId as Id<"orgAccessRequest">, status: status });
                
            }

            // Reset proposed statuses
            setProposedStatuses(prev => {
                const newStatuses = { ...prev };
                delete newStatuses[requestId || ''];
                return newStatuses;
            });

        } catch (error) {
            console.error("Failed to process access request:", error);
        }
    };


    return (
        <div className="w-full bg-card mx-auto py-4">
            <ScrollArea

            >
                    {/* <h2 className="text-lg font-semibold mb-4">Pending Requests</h2> */}
                    <Table className="w-full m-0">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orgAccessRequests?.map((request) => {
                                // Determine the current effective status
                                const effectiveStatus = proposedStatuses[request._id] || request.status || "pending";

                                // Check if a different status has been proposed
                                const hasProposedStatus =
                                    proposedStatuses[request._id] &&
                                    proposedStatuses[request._id] !== request.status;

                                return (
                                    <TableRow key={request._id}>
                                        <TableCell>{request.userName} -{request._id}</TableCell>
                                        <TableCell>{request.email}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={effectiveStatus}
                                                onValueChange={(value) =>
                                                    setProposedStatuses(prev => ({
                                                        ...prev,
                                                        [request._id]: value as "pending" | "accepted" | "cancelled"
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="accepted">Accept</SelectItem>
                                                    <SelectItem value="cancelled">Cancel</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            {hasProposedStatus && (
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                request.userID,
                                                                proposedStatuses[request._id],
                                                                request._id,
                                                                orgId
                                                            )
                                                        }
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                request.userID,
                                                                proposedStatuses[request._id],
                                                                request._id
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
                </div>
    );
}

interface UserAcceptDialogProps {
    onConfirm: () => void
}

function UserAcceptDialog({ onConfirm }: UserAcceptDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the user account
                        and remove their data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => document.getElementById('closeDialog')?.click()}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={() => {
                        onConfirm()
                        document.getElementById('closeDialog')?.click()
                    }}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}