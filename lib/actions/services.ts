import { FormValues } from "@/components/service-form";

const BASE_URL=process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const createServices = async(data:FormValues) => {
    const res = await fetch(`${BASE_URL}/services`, {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    return res.json()
}





// const BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// export const createServices = async (data: FormData) => {
//   const res = await fetch(`${BASE_URL}/services`, {
//     method: "POST",
//     body: data,
//   })

//   if (!res.ok) {
//     throw new Error("Failed to create service")
//   }

//   return res.json()
// }