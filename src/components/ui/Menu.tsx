import { Menu, Transition, Dialog } from "@headlessui/react";
import { Fragment, useState } from "react";
import {
  Bars3Icon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Button } from "./Button";
import { inListIconProps } from "./Svg";

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  onDelete: () => void;
  onEdit: () => void;
}

const MenuDropDown: React.FC<MenuProps> = ({ ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const modal = (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Do you want to delete this Post?
                </Dialog.Title>

                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => {
                      closeModal();
                    }}
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-500 px-4 py-2 text-sm font-medium text-gray-100 hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={() => {
                      closeModal();
                      props.onDelete();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );

  return (
    <Menu as="div" className="relative inline-block">
      {modal}
      <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-0 px-1.5 py-1.5 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        <Bars3Icon
          className=" h-4 w-4 text-gray-600 opacity-0 hover:text-violet-100 group-hover:opacity-100"
          aria-hidden="true"
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-black bg-opacity-30 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Button
                intent={"inList"}
                hover={active}
                onClick={() => props.onEdit()}
              >
                <PencilSquareIcon {...inListIconProps}></PencilSquareIcon>
                Edit
              </Button>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <Button
                intent={"inList"}
                hover={active}
                onClick={() => openModal()}
              >
                <TrashIcon {...inListIconProps}></TrashIcon>
                Delete
              </Button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default MenuDropDown;
