import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  type = "info",
}) {
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/40 text-green-900 dark:text-green-100";
      case "error":
        return "bg-red-50 dark:bg-red-900/40 text-red-900 dark:text-red-100";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-100";
      default:
        return "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100";
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`relative transform overflow-hidden rounded-xl px-6 py-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md ${getTypeStyles()}`}
              >
                {/* Close button */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
                  >
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Modal Title */}
                <Dialog.Title as="h3" className="text-lg font-semibold mb-3">
                  {title}
                </Dialog.Title>

                {/* Modal Content */}
                <div>{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
