"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const allUsers = [
  { id: 1, email: "acevedodonald@myers-blair.com", firstName: "Pamela", lastName: "Lee", role: "ADMIN" },
  { id: 2, email: "janicegonzalez@hall.info", firstName: "Anna", lastName: "Cook", role: "ADMIN" },
  { id: 3, email: "jill94@gmail.com", firstName: "Keith", lastName: "Kelly", role: "USER" },
  { id: 4, email: "anthony49@yahoo.com", firstName: "Diane", lastName: "Anderson", role: "USER" },
  { id: 5, email: "jerrywilliams@hotmail.com", firstName: "Alexis", lastName: "Stephenson", role: "ADMIN" },
  { id: 6, email: "johnsonbradley@gmail.com", firstName: "John", lastName: "Moore", role: "USER" },
  { id: 7, email: "laura77@gmail.com", firstName: "Matthew", lastName: "Graham", role: "USER" },
  { id: 8, email: "harry54@ross.com", firstName: "Stacy", lastName: "Raymond", role: "ADMIN" },
  { id: 9, email: "woodmichael@mullins.net", firstName: "Collin", lastName: "Travis", role: "USER" },
  { id: 10, email: "charles97@lee.com", firstName: "Erin", lastName: "Mitchell", role: "ADMIN" },
  { id: 11, email: "katherinerogers@yahoo.com", firstName: "Ashley", lastName: "Macdonald", role: "USER" },
  { id: 12, email: "michelehanson@russell.com", firstName: "Curtis", lastName: "Gonzalez", role: "ADMIN" },
  { id: 13, email: "ysmith@yahoo.com", firstName: "Benjamin", lastName: "Yates", role: "USER" },
  { id: 14, email: "jennifer79@wells.com", firstName: "Barbara", lastName: "Gordon", role: "ADMIN" },
  { id: 15, email: "wilsonkaren@willis.biz", firstName: "Tonya", lastName: "Bass", role: "USER" },
];

const USERS_PER_PAGE = 5;

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState(allUsers);
  const [search, setSearch] = useState(""); // <--- NEW: search state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number | null }>({ id: null });

  // Filter logic
  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(q) ||
      user.lastName.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

  // Pagination logic applies to filtered users
  const indexOfLast = currentPage * USERS_PER_PAGE;
  const indexOfFirst = indexOfLast - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleDelete = () => {
    if (confirmDelete.id !== null) {
      setUsers((prev) => prev.filter((user) => user.id !== confirmDelete.id));
      setConfirmDelete({ id: null });
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleAddOrUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const updatedUser = {
      id: editingUser ? editingUser.id : users.length + 1,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
    };

    if (editingUser) {
      setUsers((prev) =>
        prev.map((user) => (user.id === editingUser.id ? updatedUser : user))
      );
    } else {
      setUsers((prev) => [...prev, updatedUser]);
    }

    setIsModalOpen(false);
    setEditingUser(null);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if (!open) setEditingUser(null); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddOrUpdateUser} className="space-y-4">
              <div><Label htmlFor="firstName">First Name</Label><Input name="firstName" id="firstName" defaultValue={editingUser?.firstName} required /></div>
              <div><Label htmlFor="lastName">Last Name</Label><Input name="lastName" id="lastName" defaultValue={editingUser?.lastName} required /></div>
              <div><Label htmlFor="email">Email</Label><Input type="email" name="email" id="email" defaultValue={editingUser?.email} required /></div>
              <div><Label htmlFor="role">Role</Label><Input name="role" id="role" placeholder="USER or ADMIN" defaultValue={editingUser?.role} required /></div>
              <div className="flex justify-end gap-2 pt-4">
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80"
        />
        <span className="text-neutral-500 text-sm">
          {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
        </span>
      </div>

      <Dialog open={confirmDelete.id !== null} onOpenChange={(open) => !open && setConfirmDelete({ id: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this user?</p>
          <div className="flex justify-end gap-2 pt-4">
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 md:p-8 bg-white dark:bg-neutral-900">
        <Table>
          <TableCaption className="text-neutral-500">List of registered users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: USERS_PER_PAGE }).map((_, idx) => (
                  <TableRow key={idx} className="animate-pulse">
                    <TableCell><div className="h-4 w-8 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                    <TableCell><div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                    <TableCell><div className="h-4 w-48 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                    <TableCell className="text-right"><div className="h-4 w-16 ml-auto bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                    <TableCell className="text-right"><div className="h-4 w-20 ml-auto bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  </TableRow>
                ))
              : currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-right">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold
                        ${user.role === "ADMIN"
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"}`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(user)}>
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setConfirmDelete({ id: user.id })}>
                        <Trash2 className="w-4 h-4 mr-1 text-red-600" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {!loading && (
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="px-2 text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
