import { create } from 'zustand';
import { TICKET_STATUS, TICKET_PRIORITY } from '../utils/constants';


// Mock data
const mockTickets = [
  {
    id: '1',
    subject: 'Unable to login to my account',
    description: 'I am getting an error when trying to login',
    status: TICKET_STATUS.OPEN,
    priority: TICKET_PRIORITY.HIGH,
    category: 'TECHNICAL',
    customerId: '101',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    assignedTo: 'agent-1',
    assignedToName: 'Sarah Smith',
    createdAt: '2024-02-05T10:30:00Z',
    updatedAt: '2024-02-05T11:45:00Z',
    slaDeadline: '2024-02-06T10:30:00Z',
  },
  {
    id: '2',
    subject: 'Billing issue with last invoice',
    description: 'I was charged twice for the same service',
    status: TICKET_STATUS.IN_PROGRESS,
    priority: TICKET_PRIORITY.URGENT,
    category: 'BILLING',
    customerId: '102',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    assignedTo: 'agent-2',
    assignedToName: 'Mike Johnson',
    createdAt: '2024-02-05T09:15:00Z',
    updatedAt: '2024-02-05T12:20:00Z',
    slaDeadline: '2024-02-05T15:15:00Z',
  },
  {
    id: '3',
    subject: 'Feature request: Dark mode',
    description: 'Would love to have a dark mode option in the app',
    status: TICKET_STATUS.NEW,
    priority: TICKET_PRIORITY.LOW,
    category: 'FEATURE_REQUEST',
    customerId: '103',
    customerName: 'Bob Wilson',
    customerEmail: 'bob@example.com',
    assignedTo: null,
    assignedToName: null,
    createdAt: '2024-02-05T14:00:00Z',
    updatedAt: '2024-02-05T14:00:00Z',
    slaDeadline: '2024-02-08T14:00:00Z',
  },
];


const useTicketStore = create((set,get) => ({

    tickets: mockTickets,
    currentTicket: null,

    filters:{
        status: [],
        priority: [],
        category: [],
        assignedTo: null,
        serchQuery: '',
    },
    pagination: {
        currentPage : 1,
        pageSize: 10,
        totalItems: mockTickets.length,
        totalPages: Math.ceil(mockTickets.length / 10),
    },
    isLoading: false,
    error: null,


    fetchTickets: async ( ) => {

        set({ isLoading: true, error: null });

        try{
            
            // replacetimeout with api all in the future (reminder)!
            await new Promise((resolve) => {setTimeout(resolve, 500)});

            const { filters } = get();
            let filteredTickets = [...mockTickets];

            // Apply filters
            if (filters.status.length > 0) {
              filteredTickets = filteredTickets.filter(t => 
                filters.status.includes(t.status)
              );
            }
        
            if (filters.priority.length > 0) {
              filteredTickets = filteredTickets.filter(t => 
                filters.priority.includes(t.priority)
              );
            }
        
            if (filters.searchQuery) {
              const query = filters.searchQuery.toLowerCase();
              filteredTickets = filteredTickets.filter(t => 
                t.subject.toLowerCase().includes(query) ||
                t.description.toLowerCase().includes(query) ||
                t.customerName.toLowerCase().includes(query)
              );
            }

            set({
                tickets: filteredTickets,
                pagination: {
                    ...get().pagination,
                    totalItems: filteredTickets.length,
                    totalPages: Math.ceil(filteredTickets.length / 10),
                },
                isLoading: false,
            });

        }catch(error){
            set({
                error: error.message || 'Failed to fetch tickets',
                isLoading: false
            })

        }

    },


    fetchTicketById: async (id) => {

        set({ isLoading: true, error: null });

        try{
            
            // replacetimeout with api all in the future (reminder)!
            await new Promise((resolve) => setTimeout(resolve, 500));

            const ticket = mockTickets.find(t => t.id === id);

            if(!ticket){
                throw new Error('Ticket not found');
            }

            set({
                currentTicket: {
                  ...ticket,
                  comments: [
                    {
                      id: 'c1',
                      author: ticket.customerName,
                      authorRole: 'CUSTOMER',
                      content: ticket.description,
                      createdAt: ticket.createdAt,
                    },
                    {
                      id: 'c2',
                      author: ticket.assignedToName || 'Agent',
                      authorRole: 'AGENT',
                      content: 'Thank you for contacting us. I am looking into this issue.',
                      createdAt: '2024-02-05T11:00:00Z',
                    },
                  ],
                  attachments: [],
                },
                isLoading: false,
              });
            } catch (error) {
              set({ 
                error: error.message || 'Failed to fetch ticket',
                isLoading: false 
              });
            }
        
    }

}));

export default useTicketStore