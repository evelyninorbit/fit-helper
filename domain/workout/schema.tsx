export type Exercise = {
    id: number,
    name: string,
    unitType: "weight" | "time"
    bodyPart: "肩" | "背" | "胸" | "腿" | "手臂" | "有氧" | '核心',
    equipment: string,
    display: boolean,
    restTime: string
}