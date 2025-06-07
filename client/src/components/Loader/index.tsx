import { ButtonLoader } from "@components/ButtonLoader"

export const Loader = () => {
    return <div className="flex w-full h-full items-center justify-center bg-white top-0 left-0 absolute z-2">
        <ButtonLoader
            width={140}
            height={140}
            color={"oklch(0.623 0.214 259.815)"}
        />
    </div>
}