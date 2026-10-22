import React, { useEffect, useId, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Button from '../elements/Button';
import Alert from '../elements/Alert';
import { htmlToText } from '../../utils/format';

const TITLE_MAX = 120;

const EDITOR_CONFIG = {
  placeholder: 'List your income, expenses and goals…',
  toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', '|', 'undo', 'redo'],
};

/**
 * Title + rich-text form used for both creating and editing entries.
 * Warns before the tab closes while there are unsaved changes.
 * Passing a new `draft` object ({ title, content }) replaces the form contents, e.g. with an AI plan.
 */
const NoteEditor = ({ initialTitle = '', initialContent = '', draft, submitLabel, saving, onSubmit, onCancel }) => {
  const id = useId();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState('');
  const [editorFailed, setEditorFailed] = useState(false);
  const editorRef = useRef(null);

  const isDirty = title !== initialTitle || content !== initialContent;

  useEffect(() => {
    if (!draft) return;
    setTitle(draft.title);
    setContent(draft.content);
    setError('');
    // CKEditor's `data` prop only applies on mount, so push later changes in directly.
    editorRef.current?.setData(draft.content);
  }, [draft]);

  useEffect(() => {
    if (!isDirty) return undefined;
    const onBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle && !htmlToText(content)) {
      setError('Add a title or some details before saving.');
      return;
    }
    if (trimmedTitle.length > TITLE_MAX) {
      setError(`Keep the title under ${TITLE_MAX} characters.`);
      return;
    }

    setError('');
    const result = await onSubmit({ title: trimmedTitle, notes: content });
    if (result?.error) setError(result.error);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Alert onDismiss={() => setError('')}>{error}</Alert>

      <div>
        <label htmlFor={`${id}-title`} className="mb-1.5 block text-sm font-medium text-ink">
          Title
        </label>
        <input
          id={`${id}-title`}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={TITLE_MAX}
          placeholder="e.g. November groceries"
          className="field"
          autoComplete="off"
        />
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink">Details</span>
        {editorFailed ? (
          <Alert>The editor failed to load. Please reload the page and try again.</Alert>
        ) : (
          <div className="overflow-hidden rounded-lg">
            <CKEditor
              editor={ClassicEditor}
              config={EDITOR_CONFIG}
              data={initialContent}
              disabled={saving}
              onReady={(editor) => {
                editorRef.current = editor;
              }}
              onChange={(_event, editor) => setContent(editor.getData())}
              onError={(editorError) => {
                console.error('CKEditor error:', editorError);
                setEditorFailed(true);
              }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={saving} disabled={editorFailed}>
          {saving ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default NoteEditor;
