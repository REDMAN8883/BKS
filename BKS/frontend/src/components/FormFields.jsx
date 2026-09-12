// Inputs del perfil
export const profileFields = [
    // Section One
    {name: "nombres", label: "Nombres", type: "text", maxLength: 20, section: "initial"},
    {name: "apellidos", label: "Apellidos", type: "text", maxLength: 20, section: "initial"},
    {name: "numero_Documento", label: "Numero de documento", type: "text", maxLength: 10, pattern: "[0-9]*", section: "initial"},
    {name: "id_Document", label: "Tipo de documento", type: "select", section: "initial"},
    {name: "prefijo", label: "Prefijo", section: "initial"},
    {name: "numero_Celular", label: "Numero celular", type: "text", maxLength: 10, section: "initial"},
    {name: "correo_Empresarial", label: "Correo electronico", type: "email", section: "initial"},
    {name: "correo_Personal", label: "Correo electronico", type: "email", section: "initial"},

    // Section Two
    {name: "departamento", label: "Departamento", type: "select", section: "address"},
    {name: "ciudad", label: "Ciudad", type: "select", section: "address"},
    {name: "barrio", label: "Barrio", type: "text", maxLength: 30, section: "address"},
    {name: "direccion", label: "Dirección", type: "text", maxLength: 100, section: "address"},
    {name: "codigo_Postal", label: "Codigo postal", type: "text", maxLength: 10, section: "address"},
    {name: "indicaciones_Adicionales", label: "Indicaciones adicionales", type: "textarea", maxLength: 100, section: "address"}
]