export const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Upload to Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("broadcasts")
        .upload(fileName, file);

      if (storageError) throw storageError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("broadcasts")
        .getPublicUrl(fileName);

      // 3. Save to Database Table (The link to the Principal)
      const { error: dbError } = await supabase
        .from("submissions")
        .insert([{
          teacher_email: user.email,
          file_url: publicUrl,
          file_name: file.name,
          status: 'pending'
        }]);

      if (dbError) throw dbError;

      toast.success("File uploaded and sent to Principal!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };