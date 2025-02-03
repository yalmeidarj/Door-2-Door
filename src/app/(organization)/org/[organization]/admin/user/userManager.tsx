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
import { MdNotInterested } from "react-icons/md";
import { Switch } from "@/components/ui/switch";


interface User {
    _id: string;
    _creationTime: number;
    name?: string;
    email: string;
    role?: "dev" | "admin" | "user";
    shiftMaxInactiveTime?: number;
    shiftMaxInactiveTimeFinal?: number;
    userId?: string;
    emailVerified?: number;
    image?: string;
    organizationId?: string;
}


export default function UserManager() {
    const updateUser = useMutation(api.users.updateUser);
    const removeUserFromOrg = useMutation(api.users.removeUserFromOrg);    
    const unblockUser = useMutation(api.users.switchUserBlockStatus);
    const [users, setUsers] = useState<User[]>([]);

    const [editingUser, setEditingUser] = useState<{
        [userId: string]: {
            name?: string;
            role?: "dev" | "admin" | "user";
            shiftMaxInactiveTime?: number;
            shiftMaxInactiveTimeFinal?: number;
        }
    }>({});

    const pathName = usePathname();
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");
    const orgId = useQuery(api.organization.getOrgByName, { name: orgName })?._id;
    const orgUsers = useQuery(api.users.getAllUsersInOrgByName, { orgName: orgName });

    if (!orgUsers) {
        return <div>Finding Users: {orgName}...</div>;
    }

    const handleEdit = (userId: string, field: 'name' | 'role' | 'shiftMaxInactiveTime' | 'shiftMaxInactiveTimeFinal', value: string) => {
        setEditingUser(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [field]: field === 'shiftMaxInactiveTime' || field === 'shiftMaxInactiveTimeFinal' ? Number(value) : value
            }
        }));
    }

    const handleSubmit = async (userId: string) => {
        const updatedData = editingUser[userId];
        if (!updatedData) return;

        try {
            const updatedUser = await updateUser({
                id: userId as Id<"users">,
                ...updatedData
            });

            setEditingUser(prev => {
                const { [userId]: _, ...rest } = prev;
                return rest;
            });
            return updatedUser;
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    }

    const handleDelete = async (userId: string) => {
        try {
            const deletedUser = await removeUserFromOrg({
                userId: userId as Id<"users">
            });

            setUsers((prevUsers) =>
                prevUsers.filter((user) => user._id !== userId)
            );

            return deletedUser;
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    const isEditing = (userId: string) =>
        editingUser[userId] && (
            editingUser[userId].name !== undefined ||
            editingUser[userId].role !== undefined ||
            editingUser[userId].shiftMaxInactiveTime !== undefined ||
            editingUser[userId].shiftMaxInactiveTimeFinal !== undefined
        );

    const formatInactiveTime = (time: number | undefined) => {
        if (!time) return '';
        return time.toString();
    };

    async function onUnblockSubmit(userId: string) {
        await unblockUser({ userId: userId as Id<"users"> });
    }

    return (
        <div className="w-full bg-card mx-auto py-4">
            <ScrollArea>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Inactivity Time</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orgUsers?.map((user) => (
                            <TableRow
                                className={user.inactivityBlocked ? "bg-red-100" : ""}
                                key={user._id}>
                                <TableCell>
                                    <Input
                                        value={editingUser[user._id]?.name ?? user.name ?? ''}
                                        onChange={(e) => handleEdit(user._id, 'name', e.target.value)}
                                        className="min-w-[100px] w-full"
                                    />
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell
                                    className="flex flex-row items-center w-full justify-between"
                                >
                                    <div className='flex flex-col m-1'>  
                                    <Label
                                        htmlFor="AttemptTime"
                                        className="text-xs text-center"
                                    >Attempt</Label>
                                    <Input
                                        value={editingUser[user._id]?.shiftMaxInactiveTime ?? formatInactiveTime(user.shiftMaxInactiveTime)}
                                        onChange={(e) => handleEdit(user._id, 'shiftMaxInactiveTime', e.target.value)}
                                        type="number"
                                        min="0"
                                        max="1440"
                                        placeholder="Attempt"
                                            className="max-w-[60px] w-full "
                                    />
                                        </div>
                                    <div className='flex flex-col m-1'>                                    
                                    <Label
                                        htmlFor="ConsentTime"
                                        className="text-xs text-center"

                                    >Consent</Label>
                                    <Input
                                        value={editingUser[user._id]?.shiftMaxInactiveTimeFinal ?? formatInactiveTime(user.shiftMaxInactiveTimeFinal)}
                                        onChange={(e) => handleEdit(user._id, 'shiftMaxInactiveTimeFinal', e.target.value)}
                                        type="number"
                                        min="0"
                                        max="1440"
                                        placeholder="Consent"
                                            className="max-w-[60px] w-full "
                                        />
                                        </div>
                                    {user.inactivityBlocked && <>
                                        
                                        <div className="flex flex-col items-center space-x-2">
                                            <Switch
                                                id={user._id}
                                                onCheckedChange={onUnblockSubmit.bind(null, user._id)}
                                                checked />
                                            <Label htmlFor="airplane-mode">Unblock User</Label>
                                        </div>
                                    </>}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={editingUser[user._id]?.role ?? user.role ?? ''}
                                        onValueChange={(value) => handleEdit(user._id, 'role', value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="dev">Dev</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        {isEditing(user._id) && (
                                            <>
                                                <Button size="icon" variant="outline" onClick={() => handleSubmit(user._id)}>
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="outline" onClick={() => setEditingUser(prev => {
                                                    const { [user._id]: _, ...rest } = prev;
                                                    return rest;
                                                })}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                        <UserDeleteDialog onConfirm={() => handleDelete(user._id)} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
interface UserDeleteDialogProps {
    onConfirm: () => void
}

function UserDeleteDialog({ onConfirm }: UserDeleteDialogProps) {
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