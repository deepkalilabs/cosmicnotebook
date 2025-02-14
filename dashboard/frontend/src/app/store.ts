// app/store.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { CellType, NotebookStore, UserStore, ConnectorsStore, OrganizationStore, OrgUserStore, NotebookDetailStore } from './types';

export const useNotebookStore = create<NotebookStore>((set) => ({
  cells: [],
  maxExecutionCount: 0,
  
  //TODO: Add a function to add a cell with a markdown type
  addCell: (type: CellType, id?: string) => set((state) => ({
    cells: [...state.cells, {
      id: id || uuidv4(),
      code: '',
      output: '',
      executionCount: 0,
      type: type
    }]
  })),
  
  updateCellCode: (id, code) => set((state) => ({
    cells: state.cells.map(cell => 
      cell.id === id ? { ...cell, code } : cell
    )
  })),

  updateCellType: (id, type) => set((state) => ({
    cells: state.cells.map(cell => 
      cell.id === id ? { ...cell, type } : cell
    )
  })),
  
  updateCellOutput: (id, output) => set((state) => ({
    cells: state.cells.map(cell =>
      cell.id === id ? { ...cell, output, executionCount: state.maxExecutionCount + 1 } : cell
    ),
    maxExecutionCount: state.maxExecutionCount + 1
  })),
  
  deleteCell: (id) => set((state) => ({
    cells: state.cells.filter(cell => cell.id !== id)
  })),
  
  moveCellUp: (id) => set((state) => {
    const index = state.cells.findIndex(cell => cell.id === id);
    if (index <= 0) return state;
    
    const newCells = [...state.cells];
    [newCells[index - 1], newCells[index]] = [newCells[index], newCells[index - 1]];
    return { cells: newCells };
  }),
  
  moveCellDown: (id) => set((state) => {
    const index = state.cells.findIndex(cell => cell.id === id);
    if (index === -1 || index === state.cells.length - 1) return state;
    
    const newCells = [...state.cells];
    [newCells[index], newCells[index + 1]] = [newCells[index + 1], newCells[index]];
    return { cells: newCells };
  }),
  
  setCells: (cells) => set({ cells }),
}));


export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}));

export const useNotebookDetailStore = create<NotebookDetailStore>((set) => ({
  notebookDetails: null,
  setNotebookDetails: (notebookDetails) => set({ notebookDetails })
}));

export const useOrganizationStore = create<OrganizationStore>((set) => ({
  organization: null,
  setOrganization: (organization) => set({ organization })
}));
  

export const useOrgUserStore = create<OrgUserStore>((set) => ({
  orgUsers: [],
  setOrgUsers: (orgUsers) => set({ orgUsers })
}));

export const useConnectorStore = create<ConnectorsStore>((set, get) => ({
  isDialogOpen: false,
  connectors: [],
  selectedConnector: null,
  isLoading: false,
  error: null,
  openDialog: () => set({ isDialogOpen: true }),
  closeDialog: () => set({ isDialogOpen: false }),
  setConnectors: (connectors) => set({ connectors }),
  setSelectedConnector: (connector) => set({ selectedConnector: connector }),
  resetDialog: () => set({ isDialogOpen: false, selectedConnector: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  addConnector: (connector) => {
    set(() => ({
      connectors: [...(get().connectors || []), connector]
    }));
  },
  updateConnector: (connector) => set((state) => ({
    connectors: (state.connectors || []).map(c => c.id === connector.id ? connector : c)
  })),
  deleteConnector: (connector) => set((state) => ({
    connectors: (state.connectors || []).filter(c => c.id !== connector.id)
  })),
  getConnectorByType: (type) => get().connectors.find(c => c.connector_type === type) || null,
  getConnectorById: (id) => get().connectors.find(c => c.id === id) || null,
  hasConnector: (type) => get().connectors.some(c => c.connector_type === type),
  removeConnector: (connector) => set((state) => ({
    connectors: state.connectors.filter(c => c.id !== connector.id)
  })),
  resetConnectors: () => set({ connectors: [] })
}));

