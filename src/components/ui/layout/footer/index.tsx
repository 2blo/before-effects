import { BsGithub } from "react-icons/bs";

export const Footer = () => {
  return (
    <div className="absolute bottom-0 flex h-16 w-full justify-center bg-black bg-opacity-60">
      <a
        className="flex justify-center gap-2"
        target="_blank"
        href="https://github.com/2blo/before-effects/issues/new/choose"
        rel="noreferrer"
        style={{ color: "inherit", textDecoration: "inherit" }}
      >
        <BsGithub className="m-auto text-white"></BsGithub>
        <h1 className="m-auto text-base text-white">
          Raise an issue or feature request
        </h1>
      </a>
    </div>
  );
};
