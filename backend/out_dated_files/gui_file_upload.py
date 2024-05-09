import streamlit as st

def main():
    print("Started ....")
    st.title("File Uploader Example")

    uploaded_file = st.file_uploader("Choose a file", type=["csv", "txt"])

    if uploaded_file is not None:
        st.success("File uploaded successfully!")

        # You can process the uploaded file here
        # For example, you can read and display its contents
        file_contents = uploaded_file.read()
        st.write("File contents:")
        st.write(file_contents)
    print("Finished ....")


if __name__ == "__main__":
    main()