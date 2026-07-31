"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Users, ArrowLeft, Search, ShieldCheck, UserCheck, UserX } from "lucide-react";

export default function UserDirectoryManagementPage() {
  const [users, setUsers] = useState([
    { id: "u-101", name: "Dr. Rahul Sharma", email: "rahul.sharma@example.com", role: "Student", plan: "Premium Pro", status: "ACTIVE" },
    { id: "u-102", name: "Dr. V. K. Ivanov", email: "ivanov@kurskmed.ru", role: "Faculty", plan: "Institutional", status: "ACTIVE" },
    { id: "u-103", name: "Prof. Elena Petrov", email: "elena.p@kurskmed.ru", role: "Dept Admin", plan: "Institutional", status: "ACTIVE" }
  ]);

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" } : u))
    );
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-6xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Super Admin Command Center</span>
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">User Directory & Roles</h1>
          <p className="text-xs text-slate-500">Manage 14.2k candidates, role assignments, suspensions, and impersonation.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Subscription</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="p-3 font-mono text-slate-500">{u.email}</td>
                    <td className="p-3 font-bold text-teal-600">{u.role}</td>
                    <td className="p-3 font-bold text-slate-700 dark:text-slate-300">{u.plan}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        u.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 font-bold text-[11px]"
                      >
                        {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
