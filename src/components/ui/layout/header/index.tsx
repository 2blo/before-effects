import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useRouter } from "next/router";
import { Button } from "@ui/Button";
import {
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { inListIconProps } from "@ui/Svg";

export const Header = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const avatarMenu = (
    <Menu as="div" className="relative my-2 mr-10 aspect-square shadow-xl">
      <div>
        <Menu.Button className="group">
          <Image
            className="absolute top-0 bottom-0 aspect-square rounded-full object-cover outline outline-1 outline-offset-2 group-hover:outline-white group-focus:outline-white"
            src="/lifeform.jpg"
            alt="Log in or manage profile."
            width={100}
            height={100}
          />
          <ChevronDownIcon
            className="absolute -bottom-[11px] -right-[25px] h-8 w-8 text-red-700 group-hover:text-white group-focus:text-white"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-8 -mr-4 w-56 origin-top-right rounded-md bg-black bg-opacity-30 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          {sessionData &&
            sessionData.user &&
            !router.asPath.startsWith(`/user/${sessionData?.user?.id}`) && (
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href={`/user/${sessionData?.user?.id}`}
                    style={{ color: "inherit", textDecoration: "inherit" }}
                  >
                    <Button intent={"inList"} hover={active}>
                      <UserCircleIcon {...inListIconProps}></UserCircleIcon>
                      Your Portfolio
                    </Button>
                  </Link>
                )}
              </Menu.Item>
            )}
          {sessionData && sessionData.user && (
            <Menu.Item>
              {({ active }) => (
                <Button intent={"inList"} hover={active}>
                  <Cog6ToothIcon {...inListIconProps}></Cog6ToothIcon>
                  Edit Profile
                </Button>
              )}
            </Menu.Item>
          )}
          <Menu.Item>
            {({ active }) => (
              <Button
                intent={"inList"}
                hover={active}
                onClick={sessionData ? () => signOut() : () => signIn()}
              >
                {sessionData ? (
                  <ArrowRightOnRectangleIcon
                    {...inListIconProps}
                  ></ArrowRightOnRectangleIcon>
                ) : (
                  <ArrowLeftOnRectangleIcon
                    {...inListIconProps}
                  ></ArrowLeftOnRectangleIcon>
                )}
                {sessionData ? "Sign out" : "Sign in"}
              </Button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
  return (
    <div className="absolute z-10 flex h-16 w-full justify-between bg-black bg-opacity-20">
      <Link
        className="mt-auto mb-auto ml-4"
        href={"/"}
        style={{ color: "inherit", textDecoration: "inherit" }}
      >
        <h1 className=" text-5xl font-extrabold tracking-tight text-white">
          <span className="text-[hsl(0,70%,40%)]">B</span>e
        </h1>
      </Link>
      <div className="flex gap-4">
        <Link href={"/upload"}>
          <button
            onMouseOver={(e) =>
              (e.currentTarget.innerText = sessionData
                ? "Upload"
                : "Sign in to Upload")
            }
            onMouseLeave={(e) => (e.currentTarget.innerText = "Upload")}
            onFocus={(e) =>
              (e.currentTarget.innerText = sessionData
                ? "Upload"
                : "Sign in to Upload")
            }
            onBlur={(e) => (e.currentTarget.innerText = "Upload")}
            className="m-2 rounded-full bg-white/5 px-10 py-3 font-semibold text-white no-underline outline outline-1 outline-red-800 transition hocus:bg-white/20"
            // TODO reduce hurdle - require signin on submit
            // onClick={
            //   sessionData ? () => alert("go to upload page") : () => signIn()
            // }
          >
            Upload
          </button>
        </Link>
        {avatarMenu}
      </div>
    </div>
  );
};
