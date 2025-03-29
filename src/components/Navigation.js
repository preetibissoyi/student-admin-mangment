// import type React from "react";
// import { useState, useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { LayoutDashboard, Users, FileBarChart, LogOut, ChevronDown, GraduationCap } from "lucide-react";

// import { cn } from "@/lib/utils";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarProvider,
//   SidebarTrigger,
//   SidebarInset,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
// } from "@/components/ui/sidebar";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// const Navigation = ({ children }: { children: React.ReactNode }) =>
//   {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [adminData, setAdminData] = useState<any>({});
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

//   useEffect(() => {
//     const storedAdminData = localStorage.getItem("adminData");
//     if (storedAdminData) {
//       const parsedData = JSON.parse(storedAdminData);
//       setAdminData(parsedData);
//       setIsAdmin(!!parsedData.role);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("studentToken");
//     localStorage.removeItem("adminData");
//     localStorage.removeItem("studentData");
//     router.push("/login");
//   };

//   const toggleSection = (title: string) => {
//     setOpenSections((prev) => ({
//       ...prev,
//       [title]: !prev[title],
//     }));
//   };

//   const menuItems = isAdmin
//     ? [
//         { text: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, path: "/admin/dashboard", items: [] },
//         {
//           text: "Manage Students",
//           icon: <Users className="h-4 w-4" />, path: "/admin/students",
//           items: [
//             { text: "View All", path: "/admin/students" },
//             { text: "Add New", path: "/admin/students/new" },
//             { text: "Import", path: "/admin/students/import" },
//           ],
//         },
//         { text: "Manage Results", icon: <FileBarChart className="h-4 w-4" />, path: "/admin/results", items: [] },
//         { text: "Batch Results", icon: <GraduationCap className="h-4 w-4" />, path: "/admin/batch-results", items: [] },
//       ]
//     : [
//         { text: "My Results", icon: <FileBarChart className="h-4 w-4" />, path: "/student/results", items: [] },
//       ];

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen">
//         <Sidebar className="border-r">
//           <SidebarHeader className="border-b">
//             <div className="flex items-center gap-2 px-2 py-4">
//               <Avatar className="h-8 w-8 border-2 border-background">
//                 <AvatarFallback className="bg-primary text-primary-foreground">{isAdmin ? "A" : "S"}</AvatarFallback>
//               </Avatar>
//               <div className="flex flex-col">
//                 <span className="text-sm font-semibold">{isAdmin ? "Admin Panel" : "Student Portal"}</span>
//                 <span className="text-xs text-muted-foreground">{adminData.name || "User"}</span>
//               </div>
//             </div>
//           </SidebarHeader>

//           <SidebarContent>
//             <SidebarMenu>
//               {menuItems.map((item) => (
//                 <SidebarMenuItem key={item.text}>
//                   <SidebarMenuButton asChild>
//                     <button onClick={() => router.push(item.path)}>
//                       {item.icon}
//                       <span>{item.text}</span>
//                     </button>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarContent>

//           <SidebarFooter>
//             <Separator className="my-2" />
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
//                   <LogOut className="h-4 w-4" />
//                   <span>Logout</span>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarFooter>
//         </Sidebar>

//         <SidebarInset>
//           <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
//             <SidebarTrigger />
//             <h1 className="text-lg font-semibold">{isAdmin ? "Admin Dashboard" : "Student Portal"}</h1>
//           </header>

//           <main className="flex-1 p-4 sm:p-6">{children}</main>
//         </SidebarInset>
//       </div>
//     </SidebarProvider>
//   );
// };

// export { Navigation };