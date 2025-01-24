import { useConnectorStore } from '@/app/store';

import { ConnectorCredentials } from '@/app/types';
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