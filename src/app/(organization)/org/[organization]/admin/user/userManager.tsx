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


export default function UserManager() {
    const updateUser = useMutation(api.users.updateUser);
    const removeUserFromOrg = useMutation(api.users.removeUserFromOrg);
    const [users, setUsers] = useState<User[]>([
    ])

    const [editingUser, setEditingUser] = useState<{
        [userId: string]: {
            name?: string;
            role?: "dev" | "admin" | "user"
        }
    }>({})
    const pathName = usePathname();
    const orgName = pathName.split("/")[2].replace("%20", " ").replace("-", " ");
    const orgId = useQuery(api.organization.getOrgByName, { name: orgName })?._id;
    const orgUsers = useQuery(api.users.getAllUsersInOrgByName, { orgName: orgName });
    if (!orgUsers) {
        return <div>Finding Users: {orgName}...</div>;
    }

    const handleEdit = (userId: string, field: 'name' | 'role', value: string) => {
        setEditingUser(prev => ({
            ...prev,
            [userId]: { ...prev[userId], [field]: value }
        }))
    }

    const handleSubmit = async (userId: string) => {
        const updatedData = editingUser[userId];
        if (!updatedData) return;

        try {
            // Perform the Convex mutation to update the user in the database
            const updatedUser = updateUser({ id: userId as Id<"users">, ...updatedData });

            // Clear the editing state for this user
            setEditingUser(prev => {
                const { [userId]: _, ...rest } = prev;
                return rest;
            });
            return updatedUser
        } catch (error) {
            console.error("Failed to update user:", error);
            // Handle error: show a notification, or revert local changes if needed.
        }
    }


    const handleDelete = async (userId: string) => {
        try {
            const deletedUser = removeUserFromOrg({ userId: userId as Id<"users"> });

            // Remove the deleted user from the local state
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));

            return deletedUser
        } catch (error) {
            console.error("Failed to delete user:", error);
            // Handle error: show a notification, or revert local changes if needed.
        }
    };

    const isEditing = (userId: string) =>
        editingUser[userId] && (
            editingUser[userId].name !== undefined ||
            editingUser[userId].role !== undefined
        )

    return (
        <div className="w-full bg-card mx-auto py-4">
            <ScrollArea
                
            >

                {/* <h1 className="text-2xl font-bold mb-5">User Management</h1>
                <div className="grid gap-6 mb-6">

            <div className="bg-card p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">User List</h2> */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orgUsers?.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>
                                        <Input
                                            value={editingUser[user._id]?.name ?? user.name ?? ''}
                                            onChange={(e) => handleEdit(user._id, 'name', e.target.value)}
                                            className="min-w-[100px] w-full"
                                        />
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
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
                                                <SelectItem value="dev">Developer</SelectItem>
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
                                                        const { [user._id]: _, ...rest } = prev
                                                        return rest
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
            // </div>
            // </div>
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