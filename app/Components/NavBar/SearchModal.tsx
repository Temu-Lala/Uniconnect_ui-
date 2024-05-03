import { useRef } from "react";
import Search from "../Search/Search";
import { IoSearch } from "react-icons/io5";

const SearchModal = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const handleSearchIconClick = () => {
    modalRef.current?.showModal();
  };

  return (
    <>
      <div className="flex xl:hidden tooltip tooltip-bottom" data-tip="Search" onClick={handleSearchIconClick}>
        <button className="btn btn-ghost btn-circle">
          <IoSearch className="text-2xl cursor-pointer" />
        </button>
      </div>
      <dialog ref={modalRef} id="my_modal_2" className="modal items-start justify-items-end ">
        <div className="modal-box max-w-[90vw] w-full rounded-none p-0 px-12 h-[67px] flex items-center !bg-[#111518]">
          <Search />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default SearchModal;
