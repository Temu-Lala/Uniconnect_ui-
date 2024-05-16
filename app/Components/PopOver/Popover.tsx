'use client';
import React from "react";
import {Popover, PopoverTrigger, PopoverContent, Button, Input} from "@nextui-org/react";

export default function Popover() {
  return (
    <Popover placement="bottom" showArrow offset={10}>
      <PopoverTrigger>
        <Button color="primary">Customize</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px]">
        {(titleProps) => (
          <div className="px-1 py-2 w-full">
            <p className="text-small font-bold text-foreground" {...titleProps}>
              Dimensions
            </p>
            <div className="mt-2 flex flex-col gap-2 w-full">
                <button className=" w-full h-12 bg-black"> hjahsjahskhakjshkja </button>
                <button className=" w-full h-12 bg-black"> hjahsjahskhakjshkja </button>
                <button className=" w-full h-12 bg-black"> hjahsjahskhakjshkja </button>
                <button className=" w-full h-12 bg-black"> hjahsjahskhakjshkja </button>
                <button className=" w-full h-12 bg-black"> hjahsjahskhakjshkja </button>
                <button className=" w-full h-12 bg-black"> hjahsjahskhakjshkja </button>

           
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
