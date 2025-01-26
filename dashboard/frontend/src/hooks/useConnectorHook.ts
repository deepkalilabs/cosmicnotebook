import { useConnectorStore } from '@/app/store';

export const useConnectorHook = () => {
    const { openDialog, closeDialog, isDialogOpen } = useConnectorStore();

    const handleOpenDialog = () => {
        openDialog();
    }
    const handleCloseDialog = () => {
        closeDialog();
    }

    return {
        isDialogOpen,
        handleOpenDialog,
        handleCloseDialog,
    }
 
}