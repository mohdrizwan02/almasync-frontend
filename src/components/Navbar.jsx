"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
  ChevronDown,
  User,
  GraduationCap,
  Briefcase,
  BookOpen,
  Gift,
  MessageCircle,
  MessagesSquare,
  Bell,
  UserCircle,
  LogOut,
  LucideEdit,
  HelpCircle,
  Calendar,
  PlusCircle,
  Smile,
  Calculator,
  CreditCard,
  Settings,
  PlusSquare,
  Newspaper,
  UserStarIcon,
  UserCheck2,
  MessageCircleMoreIcon,
  BellRingIcon,
  Edit,
  HelpCircleIcon,
  Menu,
  Compass,
  ClipboardList,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ScrollProgress from "./Scroll-Progress";

const navItems = [
  {
    label: "Network",
    items: [
      {
        label: "ALumni-Directory",
        icon: GraduationCap,
        link: "/alumni-directory",
      },
      {
        label: "Student Directory",
        icon: User,
        link: "/student-directory",
      },
    ],
  },
  {
    label: "Careers",
    items: [
      {
        label: "Jobs",
        link: "/jobs",
        icon: Briefcase,
      },
      {
        label: "Internships",
        link: "/internships",
        icon: BookOpen,
      },
    ],
  },
  {
    label: "Events",
    items: [
      {
        label: "Browse Events",
        link: "/events",
        icon: Calendar,
      },
      {
        label: "Host Event",
        link: "/events/host",
        icon: PlusCircle,
      },
    ],
  },
  {
    label: "Feed",
    items: [
      {
        label: "Browse Feed",
        link: "/feed",
        icon: Compass,
      },
      {
        label: "Add Post",
        link: "/feed/create",
        icon: PlusCircle,
      },
    ],
  },
  {
    label: "Mentorship",
    items: [
      {
        label: "Browse Mentors",
        link: "/mentorships",
        icon: UserStarIcon,
      },
      {
        label: "Be a Mentor",
        link: "/mentorships/be-a-mentor",
        icon: UserCheck2,
      },
    ],
  },
  {
    label: "More",
    items: [
      {
        label: "Interviews",
        link: "/interviews",
        icon: ClipboardList,
      },
    ],
  },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  console.log(pathname);

  const navHiddenPaths = [
    "/login",
    "/register",
    "/admin/login",
    "/reset-password",
  ];

  const [commandOpen, setCommandOpen] = useState(false);
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const [active, setActive] = useState(null);

  return (
    <>
      <header
        className={cn(
          navHiddenPaths.includes(pathname) && "hidden",
          "w-full fixed top-0 bg-white border-b z-50 border-gray-200"
        )}
      >
        <div className="w-full  max-auto px-2 lg:px-4">
          <div className="flex items-center justify-between  h-16">
            <div className="flex items-center gap-10">
              <Link href="/">
                <Image
                  width={120}
                  height={80}
                  alt="AlmaSync"
                  src="/almasync.png"
                />
              </Link>

              <nav className="hidden lg:flex items-center space-x-6">
                {navItems.map((section, idx) => (
                  <DropdownMenu
                    key={idx}
                    open={active === section.label}
                    onOpenChange={(isOpen) =>
                      setActive(isOpen ? section.label : null)
                    }
                  >
                    <DropdownMenuTrigger
                      asChild
                      className="outline-none cursor-pointer"
                    >
                      <div className="flex items-center text-sm gap-1 cursor-pointer">
                        <span className="font-semibold">{section.label}</span>
                        <ChevronDown
                          className={`h-4 w-4 mt-1 transition-transform duration-200 ${
                            active === section.label ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="w-50 space-y-0.5 text-sm"
                      sideOffset={16}
                      align="start"
                    >
                      {section.items.map((item) => (
                        <DropdownMenuItem
                          asChild
                          key={item.label}
                          className="flex items-center text-sm"
                        >
                          <Link
                            href={item.link}
                            className="flex items-center text-sm"
                          >
                            <item.icon className="mr-1 h-4 w-4" />
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
              </nav>
            </div>
            <div className="flex items-center sm:gap-4 gap-2">
              <button
                onClick={() => {
                  console.log("search input clicked");
                  setCommandOpen((open) => true);
                }}
                type="button"
                className="relative  w-36 lg:w-40 h-8 rounded-xl border border-border bg-background pl-10 pr-16 text-sm text-foreground/90 outline-none focus-visible:border-ring/60 focus-visible:ring-2 focus-visible:ring-ring/20 flex items-center justify-start"
              >
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>

                <span className="text-muted-foreground/50">Search...</span>

                <kbd
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-border bg-background px-2 py-1 text-[11px] leading-none text-muted-foreground/80 shadow-sm"
                >
                  ⌘K
                </kbd>
              </button>

              <Link href={"/messaging"}>
                <MessageCircleMoreIcon className="h-5.5 w-5.5 hidden sm:block text-gray-600 hover:text-gray-800" />
              </Link>
              <Link href={"/notifications"}>
                <Bell className="h-6 w-6 text-gray-600 hover:text-gray-800" />
              </Link>
              <DropdownMenu className={""}>
                <DropdownMenuTrigger className={"cursor-pointer "} asChild>
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarImage src="/bvrit-admin.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  sideOffset={16}
                  side={"bottom"}
                  align={"end"}
                  className={"w-68"}
                >
                  <DropdownMenuItem className={"flex items-center"}>
                    <Avatar>
                      <AvatarImage src="/bvrit-admin.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold">Admin</span>
                      <span className="text-sm text-muted-foreground">
                        admin@almasync.com
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className={"flex items-center overflow-hidden "}
                  >
                    <UserCircle />
                    <Link href={"/profile"}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LucideEdit />

                    <Link href={"/profile/edit"}>Edit Profile</Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className={
                      "flex items-center overflow-hidden cursor-pointer"
                    }
                    onClick={() => {
                      console.log("Logged out");
                    }}
                  >
                    <HelpCircle />

                    <span className="">Help</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={
                      "flex items-center overflow-hidden cursor-pointer"
                    }
                    onClick={() => {
                      console.log("Logged out");
                    }}
                  >
                    <LogOut className="text-red-500" />

                    <span className="text-red-500">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Sheet>
                <SheetTrigger asChild>
                  <button
                    variant="outline"
                    aria-label="Open menu"
                    className={"lg:hidden"}
                  >
                    <Menu className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Open menu</span>
                  </button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-70 max-w-[85vw] px-0 lg:hidden"
                >
                  <SheetHeader className="px-4">
                    <SheetTitle className="text-pretty">Menu</SheetTitle>
                  </SheetHeader>

                  <nav
                    aria-label="Mobile navigation"
                    className="mt-1 h-[calc(100vh-4rem)] overflow-y-auto"
                  >
                    <Accordion type="multiple" className="w-full">
                      {navItems.map((section, idx) => (
                        <AccordionItem
                          key={section.label}
                          value={`section-${idx}`}
                          className="border-b-0"
                        >
                          <AccordionTrigger className="px-4 text-base no-underline hover:no-underline cursor-pointer">
                            {section.label}
                          </AccordionTrigger>
                          <AccordionContent className="px-2">
                            <ul className="flex flex-col gap-1">
                              {section.items.map((item) => {
                                const active = pathname === item.link;
                                return (
                                  <li key={item.label}>
                                    {/* Close the sheet when a link is clicked */}
                                    <SheetClose asChild>
                                      <div
                                        className={cn(
                                          "rounded-md flex items-center px-3 py-0.5 text-sm transition-colors",
                                          active
                                            ? "bg-primary/10 text-primary"
                                            : "hover:bg-muted"
                                        )}
                                      >
                                        <item.icon className="h-4.5 w-4.5" />
                                        <Link
                                          href={item.link}
                                          className={cn(
                                            "block rounded-md px-3 py-2 text-sm transition-colors",
                                            active
                                              ? "bg-primary/10 text-primary"
                                              : "hover:bg-muted"
                                          )}
                                          aria-current={
                                            active ? "page" : undefined
                                          }
                                        >
                                          {item.label}
                                        </Link>
                                      </div>
                                    </SheetClose>
                                  </li>
                                );
                              })}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        <ScrollProgress />
      </header>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Networking">
            <CommandItem
              onSelect={() => {
                router.push("/alumni-directory");
                setCommandOpen((open) => false);
              }}
            >
              <GraduationCap />
              <span>Alumni Directory</span>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                router.push("/student-directory");
                setCommandOpen((open) => false);
              }}
            >
              <User />
              <span>Student Directory</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Careers">
            <CommandItem
              onSelect={() => {
                router.push("/job-portal");
                setCommandOpen((open) => false);
              }}
            >
              <Briefcase />
              <span>Jobs</span>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                router.push("/job-portal/create");
                setCommandOpen((open) => false);
              }}
            >
              <PlusCircle />
              <span>Add Job</span>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                router.push("/internship-portal");
                setCommandOpen((open) => false);
              }}
            >
              <BookOpen />
              <span>Internships</span>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                router.push("/internship-portal/create");
                setCommandOpen((open) => false);
              }}
            >
              <PlusCircle />
              <span>Add Internship</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Events">
            <CommandItem
              onSelect={() => {
                router.push("/events");
                setCommandOpen((open) => false);
              }}
            >
              <Calendar />
              <span>Browse Events</span>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                router.push("/events/host");
                setCommandOpen((open) => false);
              }}
            >
              <PlusCircle />
              <span>Host Event</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Feed">
            <CommandItem
              onSelect={() => {
                router.push("/feed");
                setCommandOpen((open) => false);
              }}
            >
              <Newspaper />
              <span>Browse Posts</span>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                router.push("/feed/create");
                setCommandOpen((open) => false);
              }}
            >
              <PlusSquare />
              <span>Create Post</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Mentorship">
            <CommandItem
              onSelect={() => {
                router.push("/mentorships");
                setCommandOpen((open) => false);
              }}
            >
              <UserStarIcon />
              <span>Browse Mentors</span>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                router.push("/mentorships/be-a-mentor");
                setCommandOpen((open) => false);
              }}
            >
              <UserCheck2 />
              <span>Be a Mentor</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Profile">
            <CommandItem
              onSelect={() => {
                router.push("/profile");
                setCommandOpen((open) => false);
              }}
            >
              <UserCircle />
              <span>View Profile</span>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                router.push("/profile/edit");
                setCommandOpen((open) => false);
              }}
            >
              <Edit />
              <span>Edit Profile</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Others">
            <CommandItem
              onSelect={() => {
                router.push("/notifications");
                setCommandOpen((open) => false);
              }}
            >
              <BellRingIcon />
              <span>Notifications</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/messaging");
                setCommandOpen((open) => false);
              }}
            >
              <MessagesSquare />
              <span>Messages</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/support");
                setCommandOpen((open) => false);
              }}
            >
              <HelpCircleIcon />
              <span>Support</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default Navbar;
