"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import ShaderAnimationComponent from "./shader-anim.tsx";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden pb-[100px] pt-[100px]">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-white dark:text-white">
              Illuminate Your <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Finances
              </span>
            </h1>
          </>
        }
      >
        <div
          className="mx-auto rounded-2xl object-cover h-full object-left-top">
        <ShaderAnimationComponent />
        </div>
      </ContainerScroll>
    </div>
  );
}