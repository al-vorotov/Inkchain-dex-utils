import React from 'react';

export interface FieldConfig {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  min?: number;
  defaultValue?: number | string;
  max?: number
}

interface MintFormProps {
  fields: FieldConfig[];
  formData: { [key: string]: any };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; ticker: string; description: string; amount: number; imageUrl: string; decimals: number; }>>;
}


const MintForm: React.FC<MintFormProps> = ({
                                             fields,
                                             formData,
                                             setFormData,
                                           }) => {
  const handleChange = (id: string, value: any) => {
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  return (
    <form className="mint-form" onSubmit={(e) => e.preventDefault()}>
      {fields.map((field) => (
        <div key={field.id} className="form-group">
          <label htmlFor={field.id}>{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              rows={3}
            />
          ) : (
            <input
              id={field.id}
              type={field.type}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              maxLength={field.maxLength}
              min={field.min}
            />
          )}
        </div>
      ))}
    </form>
  );
};

export default MintForm;
