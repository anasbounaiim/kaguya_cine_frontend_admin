"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input";
import toast from "react-hot-toast";
import apiUser from "@/utils/usersApiFetch";
import { useForm } from "react-hook-form";
import { RegisterFormSchema } from "@/validators/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/utils/apiFetch";

const USERS_PER_PAGE = 5;

// Typage
type User = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  id?: number;
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // Récupère les users depuis l’API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiUser.get("/api/users");
      // On ajoute un id temporaire si pas fourni
      console.log("response :> ", response)
      setUsers(response);
    } catch {
      setUsers([]);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search & filter
  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(q) ||
      user.lastName.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  const indexOfLast = currentPage * USERS_PER_PAGE;
  const indexOfFirst = indexOfLast - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    setCurrentPage(1); // Reset page on search
  }, [search]);

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    },
  })

  async function onSubmit(values: z.infer<typeof RegisterFormSchema>) {
    try {
      const response = await api.post('/api/auth/register', values)

      console.log("response register :", response.data)
      toast.success("User created ",{
        duration: 5000,
        style: {
          border: '1px solid #4ade80',
          background: '#ecfdf5',
          color: '#065f46',
        }
      })
      fetchUsers();
      setIsModalOpen(false);
      form.reset();

    } catch {
      console.error("User creation failed")
      toast.error("",{
        duration: 5000,
        style: {
          border: '1px solid #f87171',
          background: '#fee2e2',
          color: '#b91c1c',
        }
      })
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await apiUser.delete(`/api/users/${id}`);
      fetchUsers();
      setUserToDelete(null);
      toast.success("User deleted successfully", {
        duration: 5000,
        style: { border: '1px solid #4ade80', background: '#ecfdf5', color: '#065f46' }
      });
    } catch (err) {
      console.error("Error deleting user", err);
      toast.error("Error deleting user", {
        duration: 5000,
        style: { border: '1px solid #4ade80', background: '#ecfdf5', color: '#065f46' }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if (!open) setEditingUser(null); }}>
          <DialogTrigger asChild>
            <Button className="text-white bg-red-700 cursor-pointer shadow-md" variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600 font-bold text-xl">{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}className="p-6 md:p-8">
                <div className="flex flex-col gap-10">
  
                  <div className="flex justify-between gap-8">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your first name" {...field} className="bg-white text-black" />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
  
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your last name" {...field} className="bg-white text-black" />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
  
                  <div className="flex justify-between gap-8">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="m@example.com" {...field} className="bg-white text-black" />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
  
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="***************" type="password" {...field} className="bg-white text-black" />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
  
                  <div className="flex justify-end gap-2 pt-4">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button className="bg-red-700 cursor-pointer hover:bg-red-800 px-6" type="submit">
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
            
            {/* <form onSubmit={handleAddOrUpdateUser} className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input name="firstName" id="firstName" defaultValue={editingUser?.firstName} required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input name="lastName" id="lastName" defaultValue={editingUser?.lastName} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" name="email" id="email" defaultValue={editingUser?.email} required />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input name="role" id="role" placeholder="USER or ADMIN" defaultValue={editingUser?.role} required />
              </div>
              
            </form> */}
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80"
        />
        <span className="text-neutral-400 text-sm">
          {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
        </span>
      </div>

      <Dialog open={userToDelete !== null} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 font-bold text-xl">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this user?
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                className="bg-red-700 cursor-pointer hover:bg-red-800 px-6"
                variant="destructive"
                onClick={() => {
                  if (userToDelete !== null) deleteUser(userToDelete.toString());
                }}
              >
                Delete
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <div className="rounded-3xl border-0 border-b-2 border-red-700 p-4 md:p-8 bg-black">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-white">#</TableHead>
              <TableHead className="text-white">Full Name</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Role</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: USERS_PER_PAGE }).map((_, idx) => (
                <TableRow key={idx} className="animate-pulse">
                  <TableCell><div className="h-4 w-8 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  <TableCell><div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  <TableCell><div className="h-4 w-48 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  <TableCell><div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  <TableCell><div className="h-4 w-20 ml-auto bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                </TableRow>
              ))
            ) : currentUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-neutral-400">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-white">{user.id}</TableCell>
                  <TableCell className="text-white">{user.firstName} {user.lastName}</TableCell>
                  <TableCell className="text-white">{user.email}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
                      ${user.role === "ADMIN"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"}`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => setUserToDelete(user.id!)}>
                      <Trash2 className="w-4 h-4 mr-1 text-red-600" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="self-center text-white">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Users;
