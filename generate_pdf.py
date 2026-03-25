from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Times', 'B', 16)
        self.cell(0, 10, 'PROJECT DOCUMENTATION', border=0, align='C', new_x='LMARGIN', new_y='NEXT')
        self.set_font('Times', 'B', 14)
        self.cell(0, 10, 'Database Schema Overview', border=0, align='C', new_x='LMARGIN', new_y='NEXT')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Times', 'I', 10)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', align='C')

pdf = PDF()
pdf.set_margins(left=10, top=15, right=10)
pdf.add_page()
pdf.set_text_color(0, 0, 0) # black text

tables = [
    {
        "name": "AuditLog",
        "description": "Stores user activity logs for auditing and tracking actions within the system.",
        "columns": ["Sl no", "Field", "Type", "Description"],
        "rows": [
            ["1", "_id", "ObjectId", "AuditLog unique ID (Primary Key)"],
            ["2", "userId", "ObjectId", "Reference to User (Foreign Key)"],
            ["3", "action", "String", "The action performed by the user"],
            ["4", "targetId", "ObjectId", "ID of the target entity (Optional)"],
            ["5", "targetModel", "String", "Model name of the target entity (Optional)"],
            ["6", "metadata", "Mixed", "Additional contextual data stored as an object"],
            ["7", "timestamp", "Date", "Date and time of the action (Default: Date.now)"]
        ]
    },
    {
        "name": "User",
        "description": "Stores information of all system users including their authentication details and roles.",
        "columns": ["Sl no", "Field", "Type", "Description"],
        "rows": [
            ["1", "_id", "ObjectId", "User unique ID (Primary Key)"],
            ["2", "name", "String", "Full name of the user"],
            ["3", "username", "String", "Unique username"],
            ["4", "email", "String", "Unique email address"],
            ["5", "password", "String", "Hashed password"],
            ["6", "isPublic", "Boolean", "Whether profile is public (Default: false)"],
            ["7", "role", "String", "User role (user/moderator/admin) (Default: user)"],
            ["8", "isActive", "Boolean", "Whether user account is active (Default: true)"],
            ["9", "createdAt", "Date", "Account creation date (Default: Date.now)"]
        ]
    },
    {
        "name": "Roadmap",
        "description": "Stores generated learning roadmaps for users, consisting of phases, topics, and projects.",
        "columns": ["Sl no", "Field", "Type", "Description"],
        "rows": [
            ["1", "_id", "ObjectId", "Roadmap unique ID (Primary Key)"],
            ["2", "userId", "ObjectId", "Reference to User (Foreign Key)"],
            ["3", "skill", "String", "The skill or subject being learned"],
            ["4", "phases", "Array[Object]", "List of phases (e.g., Beginner, Advanced)"],
            ["5", "phases.topics", "Array[Object]", "Sub-topics within each phase"],
            ["6", "phases.resources", "Array[Object]", "Study materials and links"],
            ["7", "capstoneProject", "Object", "Final comprehensive project details"],
            ["8", "isCompleted", "Boolean", "Whether the roadmap is fully completed"],
            ["9", "createdAt", "Date", "Creation date (Default: Date.now)"]
        ]
    }
]

for table in tables:
    pdf.set_font('Times', 'B', 12)
    pdf.cell(0, 8, f"TABLE NAME: {table['name']}", new_x='LMARGIN', new_y='NEXT')
    
    pdf.set_font('Times', '', 12)
    pdf.multi_cell(0, 6, table['description'], new_x='LMARGIN', new_y='NEXT')
    pdf.ln(3)
    
    col_widths = [15, 35, 35, 105]
    
    # Header
    pdf.set_font('Times', 'B', 12)
    for i, col in enumerate(table['columns']):
        pdf.cell(col_widths[i], 8, col, border=1, align='L')
    pdf.ln(8)
    
    # Rows
    pdf.set_font('Times', '', 12)
    for row in table['rows']:
        # To handle multi-line text cleanly, we need to track the max height in the row
        row_height = 8 * max([len(pdf.multi_cell(col_widths[i], 8, txt, split_only=True)) for i, txt in enumerate(row)])
        
        # Save current position
        x = pdf.get_x()
        y = pdf.get_y()
        
        for i, cell_val in enumerate(row):
            # Draw the box using cell, but text using multi_cell to wrap if needed
            # For simplicity, we can use cell here because our descriptions are short enough to fit in 105mm!
            # Just use cell. The description fits.
            pdf.cell(col_widths[i], 8, cell_val, border=1, align='L')
            
        pdf.ln(8)

    pdf.ln(8)

pdf.output("database_schema.pdf")
