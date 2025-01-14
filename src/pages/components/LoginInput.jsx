export default function LoginInput({ placeholder, formData, setFormData }) {
  const handleInput = (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      setFormData({
        ...formData,
        input: value,
        message: "",
        disable: false,
      });
    } else {
      setFormData({
        ...formData,
        input: value,
        message: "",
        disable: true,
      });
    }
  };

  return (
    <div className="form-floating mb-3 floatingFormCustomInput">
      <input
        type="text"
        className="form-control"
        id="floatingInput"
        placeholder="name@example.com"
        value={formData.input}
        onInput={(e) => handleInput(e)}
        style={{
          borderColor: formData.message.length > 0 ? "wheat" : "",
          boxShadow: formData.message.length > 0 ? "inset 0 0 0 1px wheat" : "",
        }}
      />
      <label htmlFor="floatingInput">{placeholder}</label>
      <p>{formData.message}</p>
    </div>
  );
}
