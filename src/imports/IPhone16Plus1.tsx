import svgPaths from "./svg-b2oo5upre1";
import imgRectangle1 from "figma:asset/965c95066fc12d9be2e9e575b78729636a0e0c88.png";

function Group3() {
  return (
    <div className="absolute contents inset-[12.91%_52.37%_79.27%_2.79%]">
      <div className="absolute bg-[rgba(158,156,149,0.21)] inset-[12.91%_76.81%_79.27%_2.79%] rounded-[12px] shadow-[0px_2px_48px_0px_rgba(0,0,0,0.04)]" data-name="Rectangle" />
      <div className="absolute bg-[rgba(158,156,149,0.21)] inset-[12.91%_52.37%_79.27%_27.23%] rounded-[12px] shadow-[0px_2px_48px_0px_rgba(0,0,0,0.04)]" data-name="Rectangle" />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[12.91%_2.31%_79.27%_52.85%]">
      <div className="absolute bg-[rgba(158,156,149,0.21)] inset-[12.91%_26.74%_79.27%_52.85%] rounded-[12px] shadow-[0px_2px_48px_0px_rgba(0,0,0,0.04)]" data-name="Rectangle" />
      <div className="absolute bg-[rgba(158,156,149,0.21)] inset-[12.91%_2.31%_79.27%_77.29%] rounded-[12px] shadow-[0px_2px_48px_0px_rgba(0,0,0,0.04)]" data-name="Rectangle" />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[12.91%_2.31%_79.27%_2.79%]">
      <Group3 />
      <Group4 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[12.91%_2.31%_79.27%_2.79%]">
      <Group6 />
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents inset-[22.23%_52.83%_69.94%_2.33%]">
      <div className="absolute bg-[rgba(158,156,149,0.21)] inset-[22.23%_77.27%_69.94%_2.33%] rounded-[12px] shadow-[0px_2px_48px_0px_rgba(0,0,0,0.04)]" data-name="Rectangle" />
      <div className="absolute bg-[rgba(158,156,149,0.21)] inset-[22.23%_52.83%_69.94%_26.77%] rounded-[12px] shadow-[0px_2px_48px_0px_rgba(0,0,0,0.04)]" data-name="Rectangle" />
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents inset-[22.23%_2.77%_69.94%_52.39%]">
      <div className="absolute bg-[rgba(158,156,149,0.21)] inset-[22.23%_27.2%_69.94%_52.39%] rounded-[12px] shadow-[0px_2px_48px_0px_rgba(0,0,0,0.04)]" data-name="Rectangle" />
      <div className="absolute bg-[rgba(158,156,149,0.21)] inset-[22.23%_2.77%_69.94%_76.83%] rounded-[12px] shadow-[0px_2px_48px_0px_rgba(0,0,0,0.04)]" data-name="Rectangle" />
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents inset-[22.23%_2.77%_69.94%_2.33%]">
      <Group13 />
      <Group14 />
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents inset-[22.23%_2.77%_69.94%_2.33%]">
      <Group15 />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[0.87%_2.31%_69.94%_2.33%]">
      <Group5 />
      <Group16 />
      <div className="absolute bg-[#d9d9d9] inset-[0.87%_2.78%_87.9%_2.33%] rounded-[10px]" />
      <div className="absolute bg-[#eae9e9] bg-[position:50%_50%,_0%_0%] bg-size-[cover,auto] inset-[1.92%_5.34%_88.95%_70.24%] rounded-[10px]" style={{ backgroundImage: `url('${imgRectangle1}')` }} />
    </div>
  );
}

function Group7() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <div className="[grid-area:1_/_1] font-['Inter:Regular',_sans-serif] font-normal ml-0 mt-0 not-italic relative text-[16px] text-neutral-100 text-nowrap">
        <p className="leading-none whitespace-pre">Button</p>
      </div>
    </div>
  );
}

function Group8() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group7 />
    </div>
  );
}

function Group9() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Group8 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#2c2c2c] inset-[8.58%_72.24%_89.21%_3.95%] rounded-[8px]" data-name="Button">
      <div className="box-border content-stretch flex gap-2 items-center justify-center overflow-clip p-[12px] relative size-full">
        <Group9 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#2c2c2c] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute contents inset-[1.92%_30%_89.21%_3.95%]">
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[5.2%_35.89%_92.07%_3.95%] leading-[0] not-italic text-[11px] text-[rgba(0,0,0,0.8)] tracking-[0.055px]">
        <p className="leading-[16px]">{`Drag and drop components onto your canvas from the Assets panel. `}</p>
      </div>
      <div className="absolute flex flex-col font-['Inter:Bold',_sans-serif] font-bold inset-[1.92%_30%_95.36%_3.95%] justify-center leading-[0] not-italic text-[28px] text-black tracking-[-0.476px]">
        <p className="leading-[32px]">Use components</p>
      </div>
      <Button />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents inset-[1.92%_30%_89.21%_3.95%]">
      <Group17 />
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents inset-[1.92%_30%_89.21%_3.95%]">
      <Group11 />
    </div>
  );
}

export default function IPhone16Plus1() {
  return (
    <div className="bg-white relative size-full" data-name="iPhone 16 Plus - 1">
      <div className="absolute inset-[66.67%_-26.93%_30.62%_122.37%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 32">
          <path clipRule="evenodd" d={svgPaths.p1e839800} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
      <Group10 />
      <Group12 />
    </div>
  );
}