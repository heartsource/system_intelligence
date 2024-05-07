import streamlit as st
import os

def main():
    print("GUI Started ....")
    st.title("Systems Intelligence")
    # Create two columns for the layout
    st.write('<div style="border: 1px solid black; padding: 10px; margin-bottom: 20px;">', unsafe_allow_html=True)

    with st.container() as top_container:
        st.subheader("File uploads to enrich Heartie and build context")
        st.subheader("1.  Select file for upload")
        uploaded_file = st.file_uploader("Choose a file", type=["csv", "txt", "pdf", "doc", "docx"])

        if uploaded_file is not None:
            from extract_text import read_file
            txt_received = read_file(uploaded_file)
            response_txt = f"File:  {uploaded_file.name} uploaded SUCCESSFULLY"
            try:
                load_content(txt_received)
            except Exception as e:
                response_txt = "Exception:  API Unavailable - contact support team"
            st.write(response_txt)
        st.subheader("2.  Enter the text for Wiki load")

        # Text box for user input
        user_input = st.text_input("Enter text:")

        # Button to submit the text
        if st.button("Submit"):
            # Consume the text entered by the user
            from extract_text import extract_text_from_wiki
            txt_received = extract_text_from_wiki(user_input)
            response_txt = "Wiki content uploaded SUCCESSFULLY"
            try:
                load_content(txt_received)
            except Exception as e:
                response_txt = "Exception:  API Unavailable - contact support team"
            #print("User input:", user_input)
            st.write(response_txt)
        st.subheader("3.  Enter the prompt (optional)")

        # Text box for user input
        prompt_input = st.text_input("Enter prompt:")

        # Button to set the prompt
        if st.button("Set Prompt"):
            response_txt = ''
            # Consume the prompt entered by the use
            try:
                prompt_received = prompt_input.strip()
                st.session_state.prompt_received = None
                if len(prompt_received) > 0:
                    st.session_state.prompt_received = prompt_received
                response_txt = 'Prompt is set'
            except Exception as e:
                response_txt = "Exception:  While setting prompt"
            #print("User input:", user_input)
            st.write(response_txt)

    st.write('<div style="border: 1px solid black; padding: 10px; margin-bottom: 20px;">', unsafe_allow_html=True)
    with st.container() as bottom_container:
        st.subheader("Ask Heartie ...")

        # Text box for user input
        user_query = st.text_input("Enter the Query:")
        response_txt = ""

        # Button to submit the text
        if st.button("Query"):
            try:
                response = query_heartie(user_query)
                response_txt = """Answer:  {}""".format(response.text)
            except Exception as e:
                response_txt = "Exception:  API Unavailable - contact support team"
            # Consume the text entered by the user
            st.write(response_txt)

    print("GUI Stopped")

def load_content(txt_content):
    import requests
    host = get_host_port()
    print('load_content on host and port: ', host)

    DATA_LOAD_API_URL = host + "/load_to_chromadb/"
    print('Sending load_content request to: ', DATA_LOAD_API_URL)

    print("Loading Content - Start")
    data = {
        "file_content": txt_content
    }
    response = requests.post(url=DATA_LOAD_API_URL, params=data)
    print("Loading Content - End", response.text)
    return response

def query_heartie(query):
    import requests
    host = get_host_port()
    print('load_content on host and port: ', host)

    QUERY_URL =  host + "/talk_to_heartie/"
    print('Sending query_heartie request to: ', QUERY_URL)

    print("Query - Start")
    print(st.session_state.prompt_received)
    data = {
        "question": query,
        "prompt": st.session_state.prompt_received
    }

    response = requests.post(url=QUERY_URL, params=data)
    print("Query - End", response.text)
    return response

def get_host_port():
    host = ""
    try:
        host = os.environ['BE_HOST']
    except Exception:
        if host == "":
            host = "http://system-intelligence-backend"

    return host


#load_content("On your corporate network - Most corporate networks are closed to the outside world. You typically use a VPN to log onto your corporate network and access resources there. You could run your Streamlit app on a server in your corporate network for security reasons, to ensure that only folks internal to your company can access it. On your corporate network - Most corporate networks are closed to the outside world. You typically use a VPN to log onto your corporate network and access resources there. You could run your Streamlit app on a server in your corporate network for security reasons, to ensure that only folks internal to your company can access it.On your corporate network - Most corporate networks are closed to the outside world. You typically use a VPN to log onto your corporate network and access resources there. You could run your Streamlit app on a server in your corporate network for security reasons, to ensure that only folks internal to your company can access it.On your corporate network - Most corporate networks are closed to the outside world. You typically use a VPN to log onto your corporate network and access resources there. You could run your Streamlit app on a server in your corporate network for security reasons, to ensure that only folks internal to your company can access it.")
#query_heartie("what is an EV?")

if __name__ == "__main__":
    main()