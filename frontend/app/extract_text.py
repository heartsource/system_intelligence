
def read_file(file_picked):
    return_value = ""
    print(file_picked.name)
    file_type = file_picked.name.split('.')[-1]
    print(file_type)
    if file_type == 'pdf':
        print("pdf upload")
        return_value = extract_text_from_pdf_file(file_picked)
    elif file_type == 'txt':
        print("txt upload")
        return_value = extract_text_from_text_file(file_picked)
    elif file_type == 'doc' or file_type == 'docx':
        print("docx upload")
        return_value = extract_text_from_doc_file(file_picked)
    else:
        print("unknown file type uploaded")
        return_value = False
        raise ValueError("Unsupported file format")

    return return_value


def extract_text_from_pdf_file(file):
    import pdfplumber
    txt_file_content = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            txt_file_content += page.extract_text()
    print(txt_file_content)
    return txt_file_content

def extract_text_from_doc_file(file):
    import docx2txt
    txt_file_content = docx2txt.process(file)
    print(txt_file_content)
    return txt_file_content

def extract_text_from_text_file(file):
    txt_file_content = open(file).read()
    print(txt_file_content)
    return txt_file_content

def extract_text_from_wiki(wiki_context):
    import wikipedia
    wikipedia.set_lang("en")
    wiki_title = wikipedia.search(wiki_context)
    print(f"Wiki Title: {wiki_title}")
    txt_content = ""
    for title in wiki_title:
        txt = ""
        print(f"Wiki Sub Title: {title}")
        try:
            print("Try block")
            txt = wikipedia.page(title).content
            #print(txt)
        except:
            print("Exception Block")
        else:
            print("Else block")
        finally:
            print("Finally block")
        print("----------------------------")
        txt_content += txt
    #print(txt_content)
    return txt_content


