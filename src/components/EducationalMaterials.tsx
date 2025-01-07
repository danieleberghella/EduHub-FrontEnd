import { Button } from "./ui/button"

export const EducationalMaterials = () => {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl">Educational Materials List in this Course:</h1>
        <Button>+</Button>
      </div>
      <div className="grid grid-cols-4 gap-20 p-8">
        <p>Obj 1</p>
        <p>Obj 2</p>
        <p>Obj 3</p>
        <p>Obj 4</p>
        <p>Obj 5</p>
        <p>Obj 6</p>
        <p>Obj 7</p>
        <p>Obj 8</p>
      </div>
    </>
  )
}
