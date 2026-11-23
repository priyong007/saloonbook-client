'use client'
import { useState } from "react"
import { Trash2Icon } from "lucide-react"
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Service } from "@/lib/service-types"
import { deleteService } from "@/lib/actions/services"




export function DeleteServicesDialog({ service }: { service: Service }) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    
    const handleDelete = async () => {
        const res = await deleteService(service._id)
        console.log('deleting ', service._id, res)

        if (res.deletedCount) {
            setOpen(false);
            toast.success("Service deleted", {
                description: "The service has been permanently deleted.",
            })
            router.refresh()
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger
                render={<Button variant="destructive"><Trash2Icon /></Button>}
            />
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete job?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete this job. View{" "}
                        <a href="#">Settings</a> delete any related data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} variant="destructive">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}